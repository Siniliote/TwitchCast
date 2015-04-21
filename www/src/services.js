angular.module('twitchcast.services', [])
.factory('URLservice', function($stateParams, $rootScope, $timeout, $http) {
    var api = 'https://api.twitch.tv/kraken/';
    var arr = '?callback=JSON_CALLBACK&limit=15&offset=0';
    return {
        games: function() {
            return api + 'games/top' + arr;
        },
        teams: function() {
            return api + 'teams' + arr;
        },
        search: function(query, type) {
            if(type == 'games')
                return api + 'search/' + type + arr + '&type=suggest&q=' + query;
            else
                return api + 'search/' + type + arr + '&q=' + query;
        },
        follow: function(username) {
            return api + 'users/' + username + '/follows/channels' + arr;
        },
        followvod: function(token) {
            return api + 'videos/followed' + arr + '&oauth_token=' + token;
        },
        followstr: function(token) {
            return api + 'streams/followed' + arr + '&oauth_token=' + token;
        },
        channel: function(name) {
            return api + 'channels/' + name + arr;
        },
        highlights: function(channel) {
            return api + 'channels/' + channel + '/videos' + arr;
        },
        broadcasts: function(channel) {
            return api + 'channels/' + channel + '/videos' + arr + '&broadcasts=true';
        },
        videos: function(game, period) {
            return api + 'videos/top' + arr + '&game=' + game + '&period=' + period;
        },
        streams: function(game) {
            if(game)
                return api + 'streams' + arr + '&game=' + game;
            else
                return api + 'streams' + arr;
        },
        update: function() {          
            var timer;
            var x = 0;
            function myLoop() {
                var auth = window.localStorage.getItem('access_token');
                var time = 60000;

                if(x == 0)
                    time = 0;

                if(auth != null) {
                    var url = api + 'streams/followed' + arr + '&oauth_token=' + auth;

                    timer = $timeout(function() {
                        }, time);
                        timer.then(function() {
                            $http.jsonp(url)
                            .success(function(data) {
                                if(data.error == null) {
                                    $rootScope.badge = data._total;
                                }
                                else {
                                    $rootScope.badge = 0;
                                }
                            })
                            .error(function() {
                                $rootScope.badge = 0;
                            });
                            myLoop()
                        },
                        function(){
                            $rootScope.badge = 0;
                        }
                    );
                }
                else {
                    $rootScope.badge = 0;
                }
                x++;
            };
            myLoop();
        }
    };
});