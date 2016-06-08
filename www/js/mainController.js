/**
 * Created by alfonso on 29/12/15.
 */

//http://jsfromhell.com/array/shuffle
function shuffle(o)
{
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

  o[15]=16;
  return o;
}

angular.module('starter')
  .controller('mainController',function($ionicPlatform,$scope,$window,$ionicPopup,Database,Language,$cordovaGlobalization ) {

    Database.loadDatabase();
    $scope.stat= Database.statistics();


    $scope.cellPosition=[];
    $scope.paths=[];
    $scope.busyCells=[];
    $scope.isMoving=null;
    $scope.step=  Math.round($window.innerWidth/4)-1;
    $scope.bCell=0;
    $scope.squareSize={width: $scope.step+'px',height:$scope.step+'px'}
    $scope.tap=0;
    $scope.right=0;
    $scope.win=0;

    //genero posizioni celle
    $scope.initPosition=function() {

      var shufIndex = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
      shufIndex= shuffle(shufIndex);

      var i=0;
      for (r = 0; r < 4; r++) {
        for (c = 0; c < 4; c++) {
          var v =
          {
            originleft: (c *  $scope.step) + 'px',
            origintop: (r *  $scope.step) + 'px',
            left: (c *  $scope.step) + 'px',
            top: (r *  $scope.step) + 'px',
            target:shufIndex[i],
            now:i+1,
            css:'of-drag-release',
            width:$scope.step+'px',
            height:$scope.step+'px',
            'line-height':$scope.step+'px'
          }
          i=i+1;
          $scope.cellPosition.push(v);
        }
      }
      $scope.cellPosition.splice(15);

      //genero path celle
      for (v = 1; v < 17; v++) {
        var p ={
          l:-1,
          r:-1,
          t:-1,
          d:-1
        };
        var l=v-1;
        if(l>0&& l<17)p.l=v-1;

        var r=v+1;
        if(r>0&& r<17)p.r=v+1;

        var t=v-4;
        if(t>0&& t<17)p.t=v-4;

        var d=v+4;
        if(d>0&& d<17)p.d=v+4;

        $scope.paths.push(p);
      }

      var v=0;
      for (r = 0; r < 4; r++) {
        for (c = 0; c < 4; c++) {
          var p =
          {
            cell: (v<15)?$scope.cellPosition[v].target:-1,
            square:v+1,
            originleft: (c * $scope.step) + 'px',
            origintop: (r * $scope.step) + 'px'
          }
          $scope.busyCells.push(p);
          v++;
        }
      }

    }

    $scope.initPosition();

    $scope.onSwipeDrag= function ($event,d,position)
    {
      var near= $scope.paths[position.now-1][d];
      $scope.direction=d;
      if(d=='l' && near>0
        && $scope.busyCells[near-1].cell==-1  )
      {
        position.left= (parseInt(position.originleft.split('p')[0])- $scope.step)+'px'
        position.css='of-drag';
        position.originleft= position.left
      }

      if(d=='r'&& near>0
        && $scope.busyCells[near-1].cell==-1)
      {
        position.left= (parseInt(position.originleft.split('p')[0])+ $scope.step)+'px'
        position.css='of-drag';
        position.originleft= position.left
      }

      if(d=='t'&& near>0
        && $scope.busyCells[near-1].cell==-1)
      {
        position.top= (parseInt(position.origintop.split('p')[0])- $scope.step)+'px'
        position.css='of-drag';
        position.origintop= position.top
      }

      if(d=='d'&& near>0
        && $scope.busyCells[near-1].cell==-1)
      {
        position.top = (parseInt(position.origintop.split('p')[0]) +  $scope.step) + 'px'
        position.css='of-drag';
        position.origintop= position.top
      }

      if(near>0 && $scope.busyCells[near-1].cell==-1) {
        $scope.busyCells[near - 1].cell = position.target;
        $scope.busyCells[position.now - 1].cell = -1;
        position.now = near
        position.css = 'of-drag-release';
        $scope.tap=$scope.tap+1;
        checkWin();
      }




    }

    $scope.saveMatch= function (status) {

      if($scope.tap==0)
        return;

      var item={};
      item.date=new Date();
      item.status=status;
      item.tap=$scope.tap;
      item.right=$scope.right;
      Database.save(item);
      $scope.stat= Database.statistics();

    }

    $scope.restart=function(win)
    {
      if(!win)
        $scope.saveMatch(false);

      $scope.cellPosition=[];
      $scope.paths=[];
      $scope.busyCells=[];
      $scope.initPosition();
      $scope.tap=0;

      if(!win)
        $scope.showAlert();

      checkWin();

    }


    var checkWin = function()
    {
      var i=0;

      angular.forEach($scope.cellPosition, function(v,k)
      {
        if(v.target== v.now)
          i++;
      });

      if(i==15) {

        $scope.saveMatch(true);
        $scope.showAlert();
        $scope.restart(true);
        $scope.win=1;
      }
      else
        $scope.win=-1;

      $scope.right=i;

    }



    //MODAL

    // An alert dialog
    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: '<h3>Benvenuto!</h3>',
        templateUrl:'my-modal.html',
        scope: $scope
      });

      alertPopup.then(function(res) {
      });
    };

    $scope.showAlert();

  });


