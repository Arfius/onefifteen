/**
 * Created by alfonso on 02/05/16.
 */
angular.module('starter.utils', [])
  .factory('Database', [ '$q', function($q) {

    var db = new loki('loki.json');
    var _matchs =db.addCollection('matchs',{disableChangesApi:false});


    return {
      save:function(item)
      {
        _matchs.insert(item);
        db.saveDatabase();

      },
      loadDatabase:function()
      {
        var deferred = $q.defer();
        db.loadDatabase({}, function ()
        {
          _matchs = db.getCollection('matchs')
          deferred.resolve(true);
        });
        return deferred.promise;
      },
      statistics: function () {
        var stat={};

        stat.total= _matchs.find().length;
        stat.win = _matchs.find({status:true}).length;


        stat.tap = _matchs.chain().find({status:true}).compoundsort(['tap']).data()[0]

        if(stat.tap===undefined)
          stat.tap = 0;
        else
          stat.tap = stat.tap.tap;

        stat.abort=stat.total-stat.win;

        var l = _matchs.chain().find().compoundsort(['tap']).data().length;

        stat.maxtap = _matchs.chain().find().compoundsort(['tap']).data()[l-1]
        if(stat.maxtap===undefined)
          stat.maxtap = 0;
        else
          stat.maxtap = stat.maxtap.tap;

        return stat;
      }

    }
  }]);
