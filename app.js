var app = angular.module('webDevTalks', []);

app.service('Data', function ($http, $sce) {
	
	this.getTalks = function () {
		return $http.get('data.json').then(function (resp) {
			return resp.data;
		});
	};

	this.parseTalkSummaryAsHTML = function (summary) {
		return $sce.trustAsHtml(summary);
	};

	this.getThumbnail = function (videoId) {
		return 'http://img.youtube.com/vi/' + videoId + '/1.jpg';
	};

	this.getEmbedUrl = function (videoId) {
		return 'https://www.youtube.com/embed/' + videoId;
	};
});

app.directive('currentVideo', function ($sce, $timeout, Data) {
	return {
		restrict: 'E',
		scope: {
			video: '=' 
		},
		require: 'ngModel',
		templateUrl: 'templates/current-video.html',
		link: function (scope, el, attrs, ngModel) {

			var labels = [
				'default',
				'danger',
				'info',
				'primary',
				'inverse'
			];

			ngModel.$render = function () {
				scope.hideVideo = true;
				scope.embedUrl = $sce.trustAsResourceUrl(Data.getEmbedUrl(ngModel.$modelValue.id));
				scope.tags = ngModel.$modelValue.tags;

				$timeout(function () {
					scope.hideVideo = false;
				}, 750);
			};

			scope.getRandomLabel = function () {
				return labels[Math.floor(Math.random() * labels.length)];
			};
		}
	}
});

app.directive('talkList', function ($sce, Data) {
	return {
		restrict: 'E',
		templateUrl: 'templates/talk-list.html',
		link: function (scope, el) {
			var setCurrentTalk = function () {
				scope.currentTalk = scope.talks[0];
			};

			scope.parseSummary = Data.parseTalkSummaryAsHTML;

			scope.changeCurrentTalk = function (index) {
				scope.currentTalk = scope.talks[index];
			};

			scope.getThumbnail = Data.getThumbnail;

			Data.getTalks().then(function (talks) {
				scope.talks = talks;
				setCurrentTalk();
			});
		}
	}
});

app.controller('mainCtrl', function ($scope, Data) {

});