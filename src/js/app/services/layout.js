angular.module('app.services').factory('topBar',function ($location) {

  var data = {};

  var model = {
    getData: function () {
      return data;
    },

    set: function (key, value) {
      data[key] = value;
      return model;
    },

    reset: function () {
      data = {};
      return model;
    },

    setLoginBar: function () {
      model.reset();
      data.right = {
        btnClass: 'btn-info',
        click: function () {
          $location.path('/terms');
        }
      };
      data.left = {
        btnClass: 'btn-reg',
        click: function () {
          $location.path('/registration');
        }
      };
    },

    setRegistrationBar: function () {
      model.reset();
      data.right = {
        btnClass: 'btn-info',
        click: function () {
          $location.path('/terms');
        }
      };
      data.back = true;
    },

    setHomeBar: function () {
      model.reset();
      data.title = 'Powerline';
      data.menu = true;
    }

  };

  return model;
}).factory('mainMenu',function ($location, $window) {

  var MenuItem = function (name, path, htmlClass, action) {
    var self = this;
    self.name = name;
    self.path = path;
    self.htmlClass = htmlClass;
    self.action = action;
  };

  MenuItem.prototype.navigate = function() {
    if (this.path) {
      $location.path(this.path);
    } else if (this.action) {
      this.action();
    }
  };

  MenuItem.prototype.getClass = function () {
    return $location.path() === this.path ? this.htmlClass + ' active' : this.htmlClass;
  };

  return {
    items: [
      new MenuItem('Home', '/main', 'home-item'),
      new MenuItem('My Groups', '/groups', 'groups-item'),
      new MenuItem('My Influences', '/influences', 'influences-item'),
      new MenuItem('My Representatives', '/representatives', 'representatives-item'),
      new MenuItem('My Profile', '/profile', 'profile-item'),
      new MenuItem('Settings', '/settings', 'settings-item'),
      new MenuItem('Other Apps', '/other-services', 'other-item'),
      new MenuItem('Take Tour', '/guide', 'help-item'),
      new MenuItem('Share this App', null, 'share-item', function() {
        $window.window.plugins.socialsharing.share(
          'I came across this app Powerline and think you will like it. Visit www.powerli.ne or download it on Google or Apple.',
          'check this out',
          null,
          'https://powerli.ne'
        );
      }),
      new MenuItem('Logout', '/logout', 'logout-item')
    ]
  };

}).factory('layout', function ($rootScope, $document, device, $location, $window, notifications, facebook, flurry, $timeout) {

  var $body, $content;
  var layout = {
    init: function () {
      $content = $document.find('.content');
      $body = $document.find('body');

      $rootScope.minContentHeight = contentHeight();
      $rootScope.$on('resize', function () {
        $rootScope.minContentHeight = contentHeight();
        $rootScope.execApply();
      });
      $rootScope.$watch('bodyClass', function () {
        $rootScope.minContentHeight = contentHeight();
      });
    },

    setContainerClass: function (value) {
      $rootScope.containerClass = value;
    },

    setBodyClass: function (value) {
      $rootScope.bodyClass = value;
    },

    focus: function(focus) {
      if ('add-comment' === focus) {
        layout.scrollToElement($body.find('.comment-answer-form textarea'));
      }
    },

    scrollToElement: function(el) {
      $timeout(function() {
        $document.find('.content').scrollTop(el.offset().top);
      }, 500, false);
    }
  };

  $rootScope.$on('$routeChangeSuccess', function () {
    $rootScope.containerClass = '';
    $rootScope.bodyClass = '';
  });

  $document.bind('deviceready', function () {
    device.init();
    notifications.init();
    facebook.init();
    flurry.init();

    if (device.isAndroid) {
      $document.bind('backbutton', function (e) {
        e.preventDefault();
        if (_(['/', '/main', '/login']).include($location.path())) {
          $window.navigator.app.exitApp();
        } else {
          $window.navigator.app.backHistory();
        }
      });
    }
  });

  function contentHeight() {
    return $body.height();
  }

  return layout;
});
