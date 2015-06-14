var app = angular.module('webDevTalks', ['firebase']);

app.service('Data', function ($http, $sce, $q, $firebaseArray) {

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

app.directive('talkList', function ($sce, Data, $firebaseArray) {
	return {
		restrict: 'E',
		templateUrl: 'templates/talk-list.html',
		link: function (scope, el) {

			scope.parseSummary = Data.parseTalkSummaryAsHTML;

			scope.changeCurrentTalk = function (index) {
				scope.currentTalk = scope.talks[index];
			};

			scope.getThumbnail = Data.getThumbnail;

			var firebaseRef 	= new Firebase("https://web-dev-talks.firebaseio.com");
			scope.talks 		= $firebaseArray(firebaseRef);
			
			scope.talks.$loaded(function (talks) {
				console.log(talks[0]);
				scope.currentTalk = talks[0];
			})
		}
	}
});

app.controller('mainCtrl', function ($scope, Data) {

});