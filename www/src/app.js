angular.module('twitchcast', [
    'ionic',
    'twitchcast.services',
    'twitchcast.controllers'
])
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('nav', {
        url: '/nav',
        abstract: true,
        templateUrl: 'src/views/navigation.html',
        controller: 'nav'
    })
    .state('nav.games', {
        url: '/games',
        views: {
            'games-tab': {
                templateUrl: 'src/views/games.html',
                controller: 'games'
            }
        }
    })
    .state('nav.game', {
        url: '/game/:name',
        views: {
            'games-tab': {
                templateUrl: 'src/views/game.html',
                controller: 'game'
            }
        }
    })
    .state('nav.channel-search', {
        url: '/channel/s/:name/:title/:ref',
        views: {
            'search-tab': {
                templateUrl: 'src/views/channel.html',
                controller: 'channel'
            }
        }
    })
    .state('nav.channel-follow', {
        url: '/channel/f/:name/:title/:ref',
        views: {
            'follow-tab': {
                templateUrl: 'src/views/channel.html',
                controller: 'channel'
            }
        }
    })
    .state('nav.follow', {
        url: '/follow/:type',
        views: {
            'follow-tab': {
                templateUrl: 'src/views/follow.html',
                controller: 'follow'
            }
        }
    })
    .state('nav.videos-highlights-follow', {
        url: '/highlights/f/:name/:title/:ref',
        views: {
            'follow-tab': {
                templateUrl: 'src/views/videos.html',
                controller: 'highlights'
            }
        }
    })
    .state('nav.videos-highlights-search', {
        url: '/highlights/s/:name/:title/:ref',
        views: {
            'search-tab': {
                templateUrl: 'src/views/videos.html',
                controller: 'highlights'
            }
        }
    })
    .state('nav.videos-broadcasts-follow', {
        url: '/broadcasts/f/:name/:title/:ref',
        views: {
            'follow-tab': {
                templateUrl: 'src/views/videos.html',
                controller: 'broadcasts'
            }
        }
    })
    .state('nav.videos-broadcasts-search', {
        url: '/broadcasts/s/:name/:title/:ref',
        views: {
            'search-tab': {
                templateUrl: 'src/views/videos.html',
                controller: 'broadcasts'
            }
        }
    })
    .state('nav.streams', {
        url: '/streams/:name',
        views: {
            'games-tab': {
                templateUrl: 'src/views/streams.html',
                controller: 'streams'
            }
        }
    })
    .state('nav.streams-live', {
        url: '/streams',
        views: {
            'streams-tab': {
                templateUrl: 'src/views/streams.html',
                controller: 'streams'
            }
        }
    })
    .state('nav.stream-live', {
        url: '/stream/l/:name',
        views: {
            'streams-tab': {
                templateUrl: 'src/views/stream.html',
                controller: 'stream'
            }
        }
    })
    .state('nav.stream-follow', {
        url: '/stream/f/:name',
        views: {
            'follow-tab': {
                templateUrl: 'src/views/stream.html',
                controller: 'stream'
            }
        }
    })
    .state('nav.stream-game', {
        url: '/stream/g/:name',
        views: {
            'games-tab': {
                templateUrl: 'src/views/stream.html',
                controller: 'stream'
            }
        }
    })
    .state('nav.stream-search', {
        url: '/stream/s/:name',
        views: {
            'search-tab': {
                templateUrl: 'src/views/stream.html',
                controller: 'stream'
            }
        }
    })
    .state('nav.videos', {
        url: '/videos/:name/:period',
        views: {
            'games-tab': {
                templateUrl: 'src/views/videos.html',
                controller: 'videos'
            }
        }
    })
    .state('nav.video-search', {
        url: '/video/s/:id',
        views: {
            'search-tab': {
                templateUrl: 'src/views/video.html',
                controller: 'video'
            }
        }
    })
    .state('nav.video-follow', {
        url: '/video/f/:id',
        views: {
            'follow-tab': {
                templateUrl: 'src/views/video.html',
                controller: 'video'
            }
        }
    })
    .state('nav.video-games', {
        url: '/video/g/:id',
        views: {
            'games-tab': {
                templateUrl: 'src/views/video.html',
                controller: 'video'
            }
        }
    })
    .state('nav.video-top', {
        url: '/video/v/:id',
        views: {
            'videos-tab': {
                templateUrl: 'src/views/video.html',
                controller: 'video'
            }
        }
    })
    .state('nav.videos-top', {
        url: '/top/:name/:period',
        views: {
            'videos-tab': {
                templateUrl: 'src/views/videos.html',
                controller: 'videos'
            }
        }
    })
    .state('nav.search', {
        url: '/search',
        views: {
            'search-tab': {
                templateUrl: 'src/views/search.html',
                controller: 'more'
            }
        }
    })
    .state('nav.search-streams', {
        url: '/search/s/:input/:type',
        views: {
            'search-tab': {
                templateUrl: 'src/views/streams.html',
                controller: 'search'
            }
        }
    })
    .state('nav.search-games', {
        url: '/search/g/:input/:type',
        views: {
            'search-tab': {
                templateUrl: 'src/views/games.html',
                controller: 'search'
            }
        }
    })
    .state('nav.search-channels', {
        url: '/search/c/:input/:type',
        views: {
            'search-tab': {
                templateUrl: 'src/views/channels.html',
                controller: 'search'
            }
        }
    })
    .state('nav.search-follow', {
        url: '/search/:username',
        views: {
            'search-tab': {
                templateUrl: 'src/views/channels.html',
                controller: 'search'
            }
        }
    })
    .state('nav.search-team', {
        url: '/teams/:team/:name',
        views: {
            'search-tab': {
                templateUrl: 'src/views/channels.html',
                controller: 'team'
            }
        }
    })
    .state('nav.search-teams', {
        url: '/teams',
        views: {
            'search-tab': {
                templateUrl: 'src/views/teams.html',
                controller: 'teams'
            }
        }
    });
    $urlRouterProvider.otherwise('/nav/games');
});