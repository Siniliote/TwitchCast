angular.module('twitchcast.controllers', [])
.controller('nav', function($scope, $rootScope, URLservice) {
    URLservice.update();
})
.controller('more', function($scope, $state, $http) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    var x = 0;

    $http.jsonp('https://www.googledrive.com/host/0B2JBNspfO2NiNDJ0aFBmTWo3WE0');

    $scope.authorize = function() {
        if(x == 0)
            window.open('https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=4uql2fe563zxgyljb7pukft0ixaa0h7&redirect_uri=http%3A%2F%2F' + $scope.url + '%2Fgettoken.php&scope=user_read channel_read user_subscriptions');
        x++;
        if(x == 3)
            x = 0;
    }
    $scope.token = function() {
        if(x == 0)
            $http.jsonp('https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=4uql2fe563zxgyljb7pukft0ixaa0h7&redirect_uri=http%3A%2F%2F' + $scope.url + '%2Fgettoken.php&scope=user_read channel_read user_subscriptions');
        x++;
        if(x == 3)
            x = 0;
    }

    window.response_domain = function(data) {
        $scope.url = data.auth;
    }
    window.response_token = function(data) {
        window.localStorage.removeItem('access_token');
        window.localStorage.setItem('access_token', data.access_token);
        window.localStorage.removeItem('refresh_token');
        window.localStorage.setItem('refresh_token', data.refresh_token);
        window.localStorage.removeItem('scope');
        window.localStorage.setItem('scope', data.scope);
        if(window.localStorage.getItem('access_token') == null) {
            $scope.button = "Get Token";
            $scope.access_token = "no token stored: Authorize the app";
        }
        else {
            $scope.button = "Refresh Token";
            $scope.access_token = window.localStorage.getItem('access_token');
            $http.jsonp('https://api.twitch.tv/kraken/user?oauth_token=' + window.localStorage.getItem('access_token') + '&callback=JSON_CALLBACK')
            .success(function(data){
                window.localStorage.removeItem('username');
                window.localStorage.setItem('username', data.name);
            });
        }
    }
    
    if(window.localStorage.getItem('access_token') == null) {
        $scope.button = "Get Token";
        $scope.access_token = "no token stored: Authorize and try again";
    }
    else {
        $scope.button = "Refresh Token";
        $scope.access_token = window.localStorage.getItem('access_token');
    }

    $scope.search = function (query, input) {
        if(query == 't' && (input == null || input.length == 0))
            $state.go('nav.search-teams');
        else if(query == 't')
            $state.go('nav.search-team', { team: input, name: input });
        else if(query == 's')
            $state.go('nav.search-streams', { input: input, type: 'streams' });
        else if(query == 'c')
            $state.go('nav.search-channels', { input: input, type: 'channels' });
        else if(query == 'f')
            $state.go('nav.search-follow', { username: input });
        else
            $state.go('nav.search-games', { input: input, type: 'games' });  
    };
    $scope.query = "c";

    $scope.open = function (url) {
        window.open(url, '_system');
    };

    $scope.goto = function (index) {
        $scope.$broadcast('slideBox.setSlide', index);
    }
    $scope.slide = function (index) {
        if(index == 0)
            $scope.title = 'More';
        else if(index == 1)
            $scope.title = 'Search';
        else if(index == 2)
            $scope.title = 'Login';
        else
            $scope.title = 'Search';
    };
    $scope.slide();
    $scope.default_slide = 1;
})
.controller('games', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        if(offset == 'next')
            var url = $scope.next + '&callback=JSON_CALLBACK';
        if(offset == 'prev')
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        if(offset == null)
            var url = URLservice.games($stateParams.name);
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.top;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
            $scope.title = 'Games (' + data._total + ')';
        })
        .error(function() {
            $scope.error = 'true';
            $scope.message = 'Error connecting to Twitch servers: Try again';
            $scope.title = 'Service Unavailable';
        });
        $scope.top = 'true';
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('game', function($scope, $stateParams) {
    $scope.title = $stateParams.name;
    $scope.ref = $stateParams.ref;
})
.controller('follow', function($scope, $stateParams, $state, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        var auth = window.localStorage.getItem('access_token');
        var username = window.localStorage.getItem('username');

        if(auth != null) {
            auth = '&oauth_token=' + auth;

            if(offset == 'next')
                var url = $scope.next + '&oauth_token=' + auth + '&callback=JSON_CALLBACK';
            if(offset == 'prev')
                var url = $scope.prev + '&oauth_token=' + auth + '&callback=JSON_CALLBACK';
            if(offset == null) {
                if($stateParams.type == 'videos')
                    var url = URLservice.followvod(auth);
                else if($stateParams.type == 'streams')
                    var url = URLservice.followstr(auth);
                else
                    if(username != null)
                        var url = URLservice.follow(username) + '&sortby=last_broadcast';
                    else
                        var url = null;
            }
            if(url != null) {
                $http.jsonp(url)
                .success(function(data) {
                    if(data.error == null) {
                        if($stateParams.type == 'all') {
                            $scope.list = data.follows;
                            $scope.title = 'Followed (all): ' + data._total;
                            $scope.ref = 'f';
                        }
                        if($stateParams.type == 'streams') {
                            $scope.list = data.streams;
                            $scope.title = 'Followed (live): ' + data._total;
                            $scope.ref = 's';
                        }
                        if($stateParams.type == 'videos') {
                            $scope.list = data.videos; 
                            $scope.title = 'Followed (videos)';
                            $scope.ref = 'v';
                        }
                        $scope.next = data._links.next;
                        $scope.prev = data._links.prev;
                        $scope.total = data._total;
                    }
                    else {
                        $scope.error = 'true';
                        $scope.message = data.message + ': Refresh token';
                        $scope.title = data.error;
                    }
                })
                .error(function() {
                    $scope.error = 'true';
                    $scope.message = 'Error connecting to Twitch servers: Try again';
                    $scope.title = 'Service Unavailable';
                });
                $ionicScrollDelegate.scrollTop();
            }
            else {
                $scope.error = 'true';
                $scope.message = 'Missing username: Refresh token';
                $scope.title = 'Forbidden';
            }
        }
        else {
            $scope.error = 'true';
            $scope.message = 'Authorize the app and get a token';
            $scope.title = 'Forbidden';
        }
    };
    $scope.reload();
})
.controller('search', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {  
    $scope.reload = function (offset) {
        if(offset == 'next')
            var url = $scope.next + '&callback=JSON_CALLBACK';
        if(offset == 'prev')
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        if(offset == null)
            if($stateParams.username)
                var url = URLservice.follow($stateParams.username) + '&sortby=last_broadcast';
            else
                var url = URLservice.search($stateParams.input, $stateParams.type);
        $http.jsonp(url)
        .success(function(data) {
            if(data.error == null) {
                if($stateParams.username) {
                    $scope.list = data.follows;
                    $scope.title = 'Followed channels: ' + data._total;
                    $scope.ref = 'f';
                }
                else {
                    if($stateParams.type == 'streams')
                    {
                        $scope.list = data.streams;
                        $scope.title = '"' + $stateParams.input + '" ' + data._total + ' results';
                        $scope.ref = 's';
                    }
                    if($stateParams.type == 'games')
                    {
                        $scope.list = data.games;
                        $scope.title = '"' + $stateParams.input + '" results';
                        $scope.top = 'false';
                    }
                    if($stateParams.type == 'channels')
                    {
                        $scope.list = data.channels;
                        $scope.title = '"' + $stateParams.input + '" ' + data._total + ' results';
                        $scope.ref = 's';
                    }
                }
                $scope.next = data._links.next;
                $scope.prev = data._links.prev;
                $scope.total = data._total;
            }
            else {
                $scope.error = 'true';
                $scope.title = data.error;
                $scope.message = data.message;
            }
        })
        .error(function() {
            $scope.error = 'true';
            $scope.message = 'Error connecting to Twitch servers: Try again';
            $scope.title = 'Service Unavailable';
        });
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('channel', function($scope, $stateParams, $http) {
    $scope.title = $stateParams.title;
    $scope.name = $stateParams.name;
    $scope.ref = $stateParams.ref;

    $http.jsonp('https://api.twitch.tv/kraken/streams/' + $scope.name + '?callback=JSON_CALLBACK')
    .success(function(data) {
        if(data.stream != null)
            $scope.online = 'true';
    })
    .error(function() {
        $scope.online = 'true';
    });
})
.controller('video', function($scope, $stateParams, $http) { 
    $http.jsonp('https://api.twitch.tv/api/videos/' + $stateParams.id + '?callback=JSON_CALLBACK')
    .success(function(data) {
        if(typeof data.chunks.live !== 'undefined') {
        	if(data.chunks.live.length > 0) {
        		$scope.type = 'chunk';
	            $scope._live = data.chunks.live;
	            $scope._720p = data.chunks["720p"];
	            $scope._480p = data.chunks["480p"];
	            $scope._360p = data.chunks["360p"];
	            $scope._240p = data.chunks["240p"];
	            $scope.title = 'Select Quality';
        	}
        	else {
        		checkvideo(data);
        	}
        }
        else {
			checkvideo(data);
        }
    })
    .error(function() {
        $scope.error = 'true';
        $scope.message = 'Error connecting to Twitch servers: Try again';
        $scope.title = 'Service Unavailable';
    });
    $scope.quality = '5';
    
    $scope.open = function (url) {
        window.open(url, '_system');
    };

    function checkvideo(data) {
    	var id = data.api_id;
		var auth = '';
		if(Object.getOwnPropertyNames(data.restrictions).length > 0)
			var restrict = true;
		else
			var restrict = false;

		if(window.localStorage.getItem('access_token') != null)
		    auth = '&oauth_token=' + window.localStorage.getItem('access_token');

		$http.jsonp('https://api.twitch.tv/api/vods/' + id.slice(1, id.length) + '/access_token?callback=JSON_CALLBACK' + auth)
		.success(function(auth) {
		    var sig = auth.sig;
		    var token = auth.token;
		    var url = 'http://usher.twitch.tv/vod/' + id.slice(1, id.length) + '?nauth=' + token + '&nauthsig=' + sig;
		    
            $http.jsonp('http://www.googledrive.com/host/0B2JBNspfO2NiNDJ0aFBmTWo3WE0');

            window.response_domain = function(data) {
                var domain = data.web;
                url = 'http://' + domain + '/getvideo.php?callback=JSON_CALLBACK&url=' + encodeURIComponent(url);

                $http.jsonp(url)
                .success(function(data) {
                    if(data.m3u == "") {
                        $scope.error = 'true';
                        $scope.message = "The playlist is empty";
                        $scope.title = 'Playlist Unavailable';
                    }
                    else {
                        var dir = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.,~#?&//=]*)/gi;
                        var fmt = /NAME=_(.*?)_/gi;
                        
                        $scope.type = 'vod';
                        $scope.fmt = data.m3u.match(fmt);
                        $scope.list = data.m3u.match(dir);
                        $scope.title = 'Select Quality';
                    }
                })
                .error(function() {
                    $scope.error = 'true';
                    $scope.title = 'Video Unavailable';
                    if(restrict)
                        $scope.message = 'The video is restricted: You may need to subscribe';
                    else
                        $scope.message = 'The video is unreachable: Please report this issue for suport';
                });
            }
		})
		.error(function() {
		    $scope.error = 'true';
		    $scope.title = 'Video Unavailable';
		    if(restrict)
		        	$scope.message = 'The video is restricted: You may need to subscribe';
		        else
		        	$scope.message = 'The video is unreachable: Please report this issue for suport';
		});
    }
})
.controller('highlights', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        if(offset == 'next')
            var url = $scope.next + '&callback=JSON_CALLBACK';
        if(offset == 'prev')
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        if(offset == null)
            var url = URLservice.highlights($stateParams.name);
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.videos;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
            $scope.total = data._total;
            $scope.title = $stateParams.title + ' Highlights';
            $scope.ref = $stateParams.ref;
        })
        .error(function() {
            $scope.error = 'true';
            $scope.message = 'Error connecting to Twitch servers: Try again';
            $scope.title = 'Service Unavailable';
        });
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('broadcasts', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        if(offset == 'next')
            var url = $scope.next + '&callback=JSON_CALLBACK';
        if(offset == 'prev')
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        if(offset == null)
            var url = URLservice.broadcasts($stateParams.name);
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.videos;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
            $scope.total = data._total;
            $scope.title = $stateParams.title + ' Past Broadcasts';
            $scope.ref = $stateParams.ref;
        })
        .error(function() {
            $scope.error = 'true';
            $scope.message = 'Error connecting to Twitch servers: Try again';
            $scope.title = 'Service Unavailable';
        });
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('videos', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        if(offset == 'next')
            var url = $scope.next + '&callback=JSON_CALLBACK';
        if(offset == 'prev')
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        if(offset == null)
            var url = URLservice.videos($stateParams.name, $stateParams.period);
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.videos;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
            $scope.total = data._total;
            if($stateParams.name){
                $scope.title = $stateParams.name + ' Videos (' + $stateParams.period + ')';
                $scope.ref = 'g';
            }
            else{
                $scope.title = 'Top Videos (' + $stateParams.period + ')';
                $scope.ref = 'v';
                $scope.top = 'true';
            }
        })
        .error(function() {
            $scope.error = 'true';
            $scope.message = 'Error connecting to Twitch servers: Try again';
            $scope.title = 'Service Unavailable';
        });
        $scope.game = $stateParams.name;
        $scope.period = 'true';
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('streams', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        if(offset == 'next')
            var url = $scope.next + '&callback=JSON_CALLBACK';
        if(offset == 'prev')
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        if(offset == null)
            var url = URLservice.streams($stateParams.name);
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.streams;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
            $scope.total = data._total;
            
            if($stateParams.name) {
                $scope.title = $stateParams.name + ' Live Channels';
                $scope.ref = 'g';
            }
            else {
                $scope.title = 'Live Channels (' + data._total + ')';
                $scope.ref = 'l';
            }
        })
        .error(function() {
            $scope.error = 'true';
            $scope.message = 'Error connecting to Twitch servers: Try again';
            $scope.title = 'Service Unavailable';
        });
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('stream', function($scope, $stateParams, $http) {
    var channel = $stateParams.name;

    $http.jsonp('http://www.googledrive.com/host/0B2JBNspfO2NiNDJ0aFBmTWo3WE0');

    window.response_domain = function(data) {
        var domain = data.web;

        $http.jsonp('http://' + domain + '/getstream.php?callback=JSON_CALLBACK&url=https://api.twitch.tv/api/channels/' + channel + '/access_token')
        .success(function(auth) {
            var sig = auth.sig;
            var token = auth.token;
            var url = 'http://usher.twitch.tv/api/channel/hls/' + channel + '.m3u8?sig=' + sig + '&token=' + token + '&allow_source=true&allow_audio_only=true';
            url = 'http://' + domain + '/getvideo.php?callback=JSON_CALLBACK&url=' + encodeURIComponent(url);
            
            $http.jsonp(url)
            .success(function(data) {
                if(data.m3u == "") {
                    $scope.error = 'true';
                    $scope.message = 'The playlist is empty'
                    $scope.title = 'Offline channel';
                }
                else{
                    var dir = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.,~#?&//=]*)/gi;
                    var fmt = /NAME=_(.*?)_/gi;
                    
                    $scope.fmt = data.m3u.match(fmt);
                    $scope.list = data.m3u.match(dir);
                    $scope.title = 'Select Quality';
                }
            })
            .error(function() {
                $scope.error = 'true';
                $scope.message = "Error connecting to the proxy server: Check that your conection is NOT HTTPS";
                $scope.title = 'Server Unavailable';
            });
        })
        .error(function() {
            $scope.error = 'true';
            $scope.message = "Error connecting to the proxy server: Check that your conection is NOT HTTPS";
            $scope.title = 'Server Unavailable';
        });
    }
    
    $scope.open = function (url) {
        window.open(url, '_system');
    };
})
.controller('teams', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        if(offset == 'next')
            var url = $scope.next + '&callback=JSON_CALLBACK';
        if(offset == 'prev')
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        if(offset == null)
            var url = URLservice.teams();
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.teams;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
            $scope.total = data._total;
            $scope.title = 'Teams';
        })
        .error(function() {
            $scope.error = 'true';
            $scope.message = 'Error connecting to Twitch servers: Try again';
            $scope.title = 'Service Unavailable';
        });
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('team', function($scope, $stateParams, $http) {
    $http.jsonp('http://www.googledrive.com/host/0B2JBNspfO2NiNDJ0aFBmTWo3WE0');

    window.response_domain = function(data) {
        var domain = data.web;

        $http.jsonp('http://' + domain + '/getstream.php?callback=JSON_CALLBACK&url=http://api.twitch.tv/api/team/' + $stateParams.team + '/live_channels.json')
        .success(function(data) {
            $scope.list = data.channels;
            $scope.title = $stateParams.name + ' live channels';
            $scope.ref = 't';
        })
        .error(function() {
            $scope.list = '';
            $scope.title = 'Not Found';
        });
    }
});
