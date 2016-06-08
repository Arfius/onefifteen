/**
 * Created by alfonso on 02/05/16.
 */
angular.module('starter.language', [])
  .factory('Language', [ function() {

    var lang="it";

    return {
      setLanguge: function (_lang) {

        lang=_lang;
      },

      getTranslation:function()
      {
        var translation={}
        if(lang=='it')
        {
          translation.title="Gioco del 15";
          translation.tap="Mosse";
          translation.inPosition="In posizione";
          translation.match="Partite";
          translation.win="Vinte";
          translation.minTap="Min Mosse x Vittoria";
          translation.abort="Abbandonate";
          translation.maxTap="Max Mosse in partita";
          translation.youwin="Complimenti!";
          translation.youlose="Oh! NO!";
        }
        else
        if(lang=='eng')
        {
          translation.title="One Fifteen Game";
          translation.tap="Move";
          translation.inPosition="Well-placed";
          translation.match="Matches";
          translation.win="Matches Won";
          translation.minTap="Less Taps for Win";
          translation.abort="Restart";
          translation.maxTap="Max Taps in match";
          translation.youwin="You Win!";
          translation.youlose="Oh! NO!";
        }


        return translation;

      }

    }
  }]);
