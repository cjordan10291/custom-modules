(function() {
    var google = 'http://pokemondb.net/pokedex/',
        totalpokemons = 0,
        responseCounts = {
            win: 0,
            stalemate: 0,
            lost: 0,
        },
        gifName = 'pokemon.gif'; // Add the gif name you want to play for a special pokemon. Add +1 in the lang for a special pokemons.

    /**
    * @function loadpokemons
    */
    function loadpokemons() {
        var i,
            data = "";
        for (i = 1; $.lang.exists('pokemonsystem.pokemon.' + i); i++) {
            totalpokemons++;
            data += 'pokemon #' + totalpokemons + ' ' + replace($.lang.get('pokemonsystem.pokemon.' + totalpokemons).replace(/\+\1/, "[RARE]").replace(/\+\2/, "[Legendary]")) + '\r\n';

        }
        $.writeToFile(data, './addons/pokemons.txt', false);
    };

    /**
    * @function loadBattles
    */
    function loadResponses() {
        var i;
        for (i = 1; $.lang.exists('pokemonsystem.win.' + i); i++) {
            responseCounts.win++;
        }

        for (i = 1; $.lang.exists('pokemonsystem.stalemate.' + i); i++) {
            responseCounts.stalemate++;
        }

        for (i = 1; $.lang.exists('pokemonsystem.lose.' + i); i++) {
            responseCounts.lost++;
        }
    };

    /**
    * @function getPokemon
    * @param pokemon
    * @return pokemon with that id
    */
    function getPokemon(pokemon) {
        if ($.lang.exists('pokemonsystem.pokemon.' + pokemon)) {
            return $.lang.get('pokemonsystem.pokemon.' + pokemon);
        } else {
            return false;
        }
    };

    /**
    * @function getrandompokemon
    * @param pokemon
    * @return random pokemon
    */
    function getrandompokemon(pokemon) {
        return $.lang.get('pokemonsystem.pokemon.' + pokemon);
    };

    /**
    * @function getUserPokemon
    * @param username
    * @param pokemon
    * @return boolean
    */
    function getUserPokemon(username, pokemon) {
        return $.inidb.exists(username.toLowerCase() + '_pokemon', 'pokemon_' + pokemon);
    };

    /**
    * @function getUserPokemons
    * @param username
    * @return amount of pokemons the user has
    */
    function getUserPokemons(username) {
        return ($.inidb.GetKeyList(username.toLowerCase() + '_pokemon', '').length ? $.inidb.GetKeyList(username.toLowerCase() + '_pokemon', '').length : 0);
    };

    /**
    * @function getUserListPokemons
    * @param username
    * @return amount of pokemons the user has
    */
    function getUserListPokemons(username) {
        return ($.inidb.GetKeyList(username.toLowerCase() + '_plist', '').length ? $.inidb.GetKeyList(username.toLowerCase() + '_plist', '').length : 0);
    };

    /**
    * @function getUserAmountpokemons
    * @param username
    * @return amount of pokemons the user has
    */
    function getUserAmountpokemons(username, pokemonid) {
        return ($.inidb.exists(username.toLowerCase() + '_pokemon', 'pokemon_' + pokemonid) ? $.inidb.get(username.toLowerCase() + '_pokemon', 'pokemon_' + pokemonid) : false);
    };
    function getUserPokemonLevel(username) {
        var pokemonKeys = $.inidb.GetKeyList(username.toLowerCase() + '_pokemon', ''),
            level = Math.ceil(getUserListPokemons(username) / 5);

        if (pokemonKeys.length === 0) {
            return level;
        }
        for (i in pokemonKeys) {
          var pokemonId = pokemonKeys[i].split('_')[1];
          if ($.lang.get('pokemonsystem.pokemon.' + pokemonId).indexOf('+1') > -1) {
                level++;
            }
        }
        return level;
    }

    /**
    * @function getUserAmountRares
    * @param username
    * @return amount of rare pokemons the user has
    */
    function getUserAmountRares(username, pokemonid) {

      var pokemonKeys = $.inidb.GetKeyList(username.toLowerCase() + '_pokemon', ''),
          rares = 0;

        for (i in pokemonKeys) {
          var pokemonId = pokemonKeys[i].split('_')[1];
          if ($.lang.get('pokemonsystem.pokemon.' + pokemonId).indexOf('+1') > -1) {
                rares++;
            }
        }
        return rares;
    }

    /**
    * @function getUserAmountLegendary
    * @param username
    * @return amount of rare pokemons the user has
    */
    function getUserAmountLegendary(username, pokemonid) {

      var pokemonKeys = $.inidb.GetKeyList(username.toLowerCase() + '_pokemon', ''),
          legendary = 0;

        for (i in pokemonKeys) {
          var pokemonId = pokemonKeys[i].split('_')[1];
          if ($.lang.get('pokemonsystem.pokemon.' + pokemonId).indexOf('+2') > -1) {
                legendary++;
            }
        }
        return legendary;
    }

    /**
    * @function getUserAmountList
    * @param username
    * @param pokemon
    * @return number
    */
    function getUserAmountList(username, pokemon) {
        if ($.inidb.exists(username.toLowerCase() + '_plist', pokemon)) {
            var keys = $.inidb.GetKeyList(username.toLowerCase() + '_plist'),
                amount = 0,
                i;

            for (i in keys) {
                if (keys[i].equals(pokemon)) {
                    amount++;
                }
            }
            return amount;
        } else {
            return 0;
        }
    };

    /**
    * @function getAmount
    * @param username
    * @param pokemon
    * @return {number}
    */
    function getAmount(username, pokemon) {
        return ($.inidb.exists(username.toLowerCase() + '_pokemon', 'pokemon_' + pokemon) ? $.inidb.get(username.toLowerCase() + '_pokemon', 'pokemon_' + pokemon) : 0);
    };

    /**
    * @function catchPokemon
    * @param username
    */
    function catchPokemon(username) {
        var random = $.randRange(1, totalpokemons),
            pokemon = String(getrandompokemon(random)),
            link = (google + url(pokemon)),
            unlock = 1,
            rare = '',
            special ='',
            shiny = $.randRange(1,200),
            chance = $.randRange(1,10);

              if (pokemon.includes('+1')) {
                chance = $.randRange(1,12);
              }

              if (pokemon.includes('+2')) {
                chance = $.randRange(1,16);
              }

            if (chance <= 8) {
                if (shiny > 199) {
                    special ='Shiny';
                    $.inidb.set(username.toLowerCase() + '_shinylist', (getUserListPokemons(username) + 1), random);
                  }

                if (pokemon.includes('+1')) {
                    $.panelsocketserver.alertImage(gifName+',5');
                    $.inidb.incr('points', username.toLowerCase(), parseInt($.lang.get('pokemonsystem.reward.rare')));
                    rare = $.lang.get('pokemonsystem.reward.message', $.lang.get('pokemonsystem.reward.rare'), $.pointNameMultiple);
                  }

                if (pokemon.includes('+2')) {
                    $.panelsocketserver.alertImage(gifName+',5');
                    $.inidb.incr('points', username.toLowerCase(), parseInt($.lang.get('pokemonsystem.reward.legend')));
                    rare = $.lang.get('pokemonsystem.reward.message', $.lang.get('pokemonsystem.reward.legend'), $.pointNameMultiple);
                  }

                if (getUserPokemon(username, random)) {
                    $.say($.lang.get('pokemonsystem.catch.own', rare + $.userPrefix(username, true), special, replace(pokemon), random, $.shortenURL.getShortURL(link)));
                    $.inidb.incr(username.toLowerCase() + '_pokemon', 'pokemon_' + random, parseInt(unlock));
                  } else {
                    $.say($.lang.get('pokemonsystem.catch.new', rare + $.userPrefix(username, true), special, replace(pokemon), random, $.shortenURL.getShortURL(link)));
                    $.inidb.incr(username.toLowerCase() + '_pokemon', 'pokemon_' + random, parseInt(unlock));
                    $.inidb.set(username.toLowerCase() + '_plist', (getUserListPokemons(username) + 1), random);
                  }
                } else {
                  $.say($.lang.get('pokemonsystem.catch.fail', $.userPrefix(username, true), special, replace(pokemon), random, $.shortenURL.getShortURL(link)));
                  return;
            }

    };

    /**
    * @function randompokemon
    * @param username
    */
    function randompokemon(username) {
        var random = $.randRange(1, totalpokemons),
            pokemon = getPokemon(random),
            link = (google + url(pokemon)),
            rare = '';

        if (pokemon.includes('+1') || pokemon.includes('+2')) {
            rare = $.lang.get('pokemonsystem.rarecheck');
            link = (google + url(pokemon));
        }

        if (!getUserListPokemons(username)) {
            $.say($.lang.get('pokemonsystem.random.0', $.userPrefix(username)));
        } else {
                var myLevel = getUserPokemonLevel(username);
            if (!getpowners(username)) {
                $.say($.lang.get('pokemonsystem.random.success', $.userPrefix(username, true), replace(pokemon), random, $.shortenURL.getShortURL(link), myLevel));
            } else {
                pokemon = getPokemon($.inidb.get('powners', username.toLowerCase()));
                $.say($.lang.get('pokemonsystem.random.married', $.userPrefix(username, true), replace(pokemon).replace('+1', $.lang.get('pokemonsystem.rare')), random, $.shortenURL.getShortURL(link), myLevel));
            }
        }
    };

    /**
    * @function sendPokemon
    * @param username
    * @param receiver
    * @param {number} pokemonid
    */
    function sendPokemon(username, receiver, pokemonid) {
        if (!pokemonid) {
            $.say($.lang.get('pokemonsystem.sendpokemon.nouser', $.userPrefix(username)));
            return;
        }
		var originalName=pokemonid;
		pokemonid=ensureId(pokemonid);
		
		if (pokemonid === 0)
		{
			$.say($.lang.get('pokemonsystem.pokefindid.notfound',originalName,$.userPrefix(username)));
		}

        var keys = $.inidb.GetKeyList(username.toLowerCase() + '_plist', ''),
            pokemon = getPokemon(pokemonid),
            link,
            i;

            if (pokemon.includes('+1') || pokemon.includes('+2')) {
                rare = $.lang.get('pokemonsystem.rarecheck');
            }

        if ($.inidb.get(username.toLowerCase() + '_pokemon', 'pokemon_' + pokemonid) >= 1 && pokemon) {
            link = (google + url(pokemon));
            for (i in keys) {
                if ($.inidb.get(username.toLowerCase() + '_pokemon', 'pokemon_' + pokemon) < 1) {
                    $.inidb.del(username.toLowerCase() + '_plist', keys[i]);
                    $.inidb.del(username.toLowerCase() + '_shinylist', keys[i]);
                    break;
                }
            }
            $.say($.lang.get('pokemonsystem.sendpokemon.success', $.userPrefix(username, true), replace(pokemon), $.userPrefix(receiver), $.shortenURL.getShortURL(link)));
            $.inidb.set(receiver.toLowerCase() + '_plist', (getUserListPokemons(receiver) + 1), pokemonid);
			if ($.inidb.get(username.toLowerCase() + '_pokemon', 'pokemon_' + pokemonid) == 1)
			{
				$.inidb.del(username.toLowerCase() + '_pokemon', 'pokemon_' + pokemonid);	
			}
			else
			{
				$.inidb.decr(username.toLowerCase() + '_pokemon', 'pokemon_' + pokemonid, 1);
			}
            $.inidb.incr(receiver.toLowerCase() + '_pokemon', 'pokemon_' + pokemonid, 1);

            if ($.inidb.get(username.toLowerCase() + '_shinylist', 'pokemon_' + pokemonid) >= 1) {
              $.inidb.set(receiver.toLowerCase() + '_shinylist', (getUserListPokemons(receiver) + 1), pokemonid);
              if ($.inidb.get(username.toLowerCase() + '_shinylist', 'pokemon_' + pokemonid) == 1)
			  {
				$.inidb.del(username.toLowerCase() + '_shinylist', 'pokemon_' + pokemonid);  
			  }
			  else
			  {
				$.inidb.decr(username.toLowerCase() + '_shinylist', 'pokemon_' + pokemonid, 1);  
			  }
              
              $.inidb.incr(receiver.toLowerCase() + '_shinylist', 'pokemon_' + pokemonid, 1);
            }

        } else {
            $.say($.lang.get('pokemonsystem.sendpokemon.404', $.userPrefix(username, true)));
        }
    };

    /**
    * @function buyPokemon
    * @param username
    * @param receiver
    * @param {number} pokemonid
    */
    function buyPokemon(event, username, receiver, pokemonid) {
		
		var pokemonCost=250,normaltorare=2,raretolegendary=2;
		
        if (!pokemonid) {
            receiver = event.getSender();
            pokemonid = ensureId(event.getArgs()[0]);
			
			if (!pokemonid)
			{
				$.say($.lang.get('pokemonsystem.buypokemon.usage',pokemonCost, pokemonCost*normaltorare, pokemonCost*normaltorare*raretolegendary));
				return;
			}
        }
		pokemonid=ensureId(pokemonid);	
		

        var pokemon = getPokemon(pokemonid),
            amount = getUserPokemons(receiver),
            unlock = 1,
            link,
            rare = '';

        if (!pokemon) {
            $.say($.lang.get('pokemonsystem.exist.404', $.userPrefix(username)));
            return;
        }

        if (pokemon.includes('+1') || pokemon.includes('+2')) {
            $.panelsocketserver.alertImage(gifName+',5');
            rare = $.lang.get('pokemonsystem.rarecheck');
			pokemonCost = pokemonCost * normaltorare;
			if (pokemon.includes('+2'))
			{
				pokemonCost = pokemonCost * raretolegendary;
			}
        }
		

		if (username.startsWith('@')) {
			username = username.substring(1).toLowerCase();
		}
		if (receiver.startsWith('@')) {
			receiver = receiver.substring(1).toLowerCase();
		}
		var currentcoins=$.inidb.get('points', username);
		
		if (!currentcoins)
		{
			currentcoins=0;
		}
		
		
		if (currentcoins < pokemonCost)
		{
			$.say($.lang.get('pokemonsystem.buypokemon.notenough', $.userPrefix(username), replace(pokemon),pokemonid,pokemonCost,$.inidb.get('points',username)));
			return;
		}
		$.inidb.decr('points',username,pokemonCost);

        link = (google + url(pokemon));

        if ($.inidb.exists(receiver.toLowerCase() + '_pokemon', 'pokemon_' + pokemonid) && pokemon) {
            $.say($.lang.get('pokemonsystem.buypokemon.own', rare + $.userPrefix(receiver, true), unlock, replace(pokemon), pokemonid, $.shortenURL.getShortURL(link),pokemonCost));
            $.inidb.incr(receiver.toLowerCase() + '_pokemon', 'pokemon_' + pokemonid, 1);
        } else {
            $.say($.lang.get('pokemonsystem.buypokemon.new', rare + $.userPrefix(receiver, true), unlock, replace(pokemon), pokemonid, $.shortenURL.getShortURL(link),pokemonCost));
            $.inidb.incr(receiver.toLowerCase() + '_pokemon', 'pokemon_' + pokemonid, 1);
            $.inidb.set(receiver.toLowerCase() + '_plist', (getUserListPokemons(receiver) + 1), pokemonid);
        }
    };

    /**
    * @function checkpokemon
    * @param username
    * @param {number} pokemonid
    * @return {string}
    */
    function checkpokemon(username, pokemonid) {
        var pokemon = getPokemon(pokemonid),
            link,
            rare = '',
            special = '';

        if (pokemon) {
            link = (google + url(pokemon));
            if (pokemon.includes('+1')|| pokemon.includes('+2')) {
                rare = $.lang.get('pokemonsystem.rarecheck');
            }

            if ($.inidb.get(username.toLowerCase() + '_shinylist', 'pokemon_' + pokemonid) >= 1 ) {
              special = 'Shiny';
            }

            $.say($.lang.get('pokemonsystem.checkpokemon.success', rare + $.userPrefix(username, true), getAmount(username, parseInt(pokemonid)), special, replace(pokemon), pokemonid, $.shortenURL.getShortURL(link)));
        } else {
            $.say($.lang.get('pokemonsystem.exist.404', $.userPrefix(username)));
        }
    };

    /**
    * @function checkpokemons
    * @param username
    * @return {string}
    */
    function checkpokemons(username) {
      var myLevel = getUserPokemonLevel(username);
        $.say($.lang.get('pokemonsystem.mypokemons.success', $.userPrefix(username), parseInt(getUserPokemons(username) - getUserAmountRares(username) - getUserAmountLegendary(username)), totalpokemons, myLevel, getUserAmountRares(username), getUserAmountLegendary(username)));
    };

    /**
    * @function setPokemon
    * @param username
    * @param {number} pokemonid
    * @return {string}
    */
    function setPokemon(username, pokemonid) {
        if (!pokemonid) {
            $.say($.lang.get('pokemonsystem.marry.null', $.userPrefix(sender)));
            return;
        }

        if (getPokemon(pokemonid) && getUserPokemon(username, pokemonid)) {
            $.say($.lang.get('pokemonsystem.marry.success', $.userPrefix(username, true), replace(getPokemon(pokemonid))));
            $.inidb.set('powners', username.toLowerCase(), pokemonid);
        } else {
            $.say($.lang.get('pokemonsystem.exist.404', $.userPrefix(username)));
        }
    };

    /**
    * @function getpowners
    * @param username
    * @return {boolean}
    */
    function getpowners(username) {
        return $.inidb.exists('powners', username.toLowerCase());
    };

    /**
    * @function battle
    * @param pokemon
    * @return Battle with another pokemon
    */
    function startBattle(username, opponent) {
      var random1 = $.randRange(1, responseCounts.win),
      random2 = $.randRange(1, responseCounts.stalemate),
      random3 = $.randRange(1, responseCounts.lost),
      results =  $.randRange(1, 10),
      team = $.inidb.GetKeyList('team', username.toLowerCase()),
      team2,
      battlepokemon,
      battlepokemon2,
      attacked,
      attacker = $.userPrefix(username);

    if (opponent === undefined) {
        $.say($.lang.get('pokemonsystem.fight.usage'));
        return;
    }

    if (opponent.startsWith('@')) {
        attacked = opponent;
        opponent = opponent.substring(1).toLowerCase();
    } else {
        attacked = $.userPrefix(opponent);
    }

      team2 = $.inidb.GetKeyList('team', opponent.toLowerCase());
      battlepokemon = getPokemon($.randElement(team));
      battlepokemon2 = getPokemon($.randElement(team2));

          if (opponent == username) {
             $.say($.lang.get('pokemonsystem.team.same'));
             return;
           }

          if (team.length > 0 && team2.length > 0) {
            if (results > 5) {
              $.say($.lang.get('pokemonsystem.win.' + random1, replace(battlepokemon), replace(battlepokemon2), attacker, attacked, $.pointNameMultiple));
              $.inidb.incr('points', username, 25);
              return;
            } else if (results == 5){
              $.say($.lang.get('pokemonsystem.stalemate.' + random2, replace(battlepokemon), replace(battlepokemon2), attacker, attacked, $.pointNameMultiple));
              return;
            } else {
              $.say($.lang.get('pokemonsystem.lose.' + random3, replace(battlepokemon), replace(battlepokemon2), attacker, attacked, $.pointNameMultiple));
              $.inidb.incr('points', opponent, 25);
              return;
            }

    } else if (!team2.length > 0){
        $.say($.lang.get('pokemonsystem.team.fight4042'));
        return;
    } else {
        $.say($.lang.get('pokemonsystem.team.fight404'));
        return;
    }

    };

    /**
    * @function replace
    * @param string
    * @return string
    */
    function replace(string) {
        return (string.replace('[Rare] ', '').replace('+1 ','').replace('+2 ', ''));
    };

    /**
    * @function url
    * @param string
    * @return string
    */
    function url(string) {
        return (string.replace('+1 ','').replace('+2 ', '').replace('\'', ''));
    };

    /**
    * @function addTeam
    * @param username
    * @param {number} pokemonid
    * @return {string}
    */
    function addTeam(sender, pokemonid) {
      var team = $.inidb.GetKeyList('team', sender.toLowerCase());
        if (!pokemonid) {
            $.say($.lang.get('pokemonsystem.team.null', $.userPrefix(sender)));
            return;
        }

        if (getPokemon(pokemonid) && getUserPokemon(sender, pokemonid)) {
          if (team.length > 6) {
            $.say($.lang.get('pokemonsystem.team.denied'));
            return;
          } else {
            $.say($.lang.get('pokemonsystem.team.success', $.userPrefix(sender, true), replace(getPokemon(pokemonid))));
            $.inidb.SetString('team', sender.toLowerCase(), pokemonid, pokemonid);
          }

        } else {
          if (team.length <= 0){
              $.say($.lang.get('pokemonsystem.team.404', $.userPrefix(sender)));
          } else if (!getUserPokemon(sender, pokemonid)) {
              $.say($.lang.get('pokemonsystem.team.nostock', $.userPrefix(sender)));
          }

        }
    };

	function buildpokemonlistdetail(username, pokemonid, position) {
        var pokemon = getPokemon(pokemonid),
            special = '';

        if (pokemon) {
            link = (google + url(pokemon));
//            if (pokemon.includes('+1')|| pokemon.includes('+2')) {
//                rare = '*';
//            }

            if ($.inidb.get(username.toLowerCase() + '_shinylist', 'pokemon_' + pokemonid) >= 1 ) {
              special = 'Shiny ';
            }

            return $.lang.get('pokemonsystem.listpokemon.page.detail', special, replace(pokemon), pokemonid , getAmount(username, parseInt(pokemonid)), position);
        } else {
            return $.lang.get('pokemonsystem.listpokemon.page.detail.notfound', pokemonid);
        }
    };
	
	function listpokemon(sender, pageNumber)
	{
		var pokemonKeys = $.inidb.GetKeyList(sender.toLowerCase() + '_pokemon', '');
		
		var numberPerPage=5;
		var outputDialogue="";
		if (pokemonKeys.length)
		{
			if (pokemonKeys.length < ( 1 + (numberPerPage * ( pageNumber -1 ) ) ) )
			{
				$.say($.lang.get('pokemonsystem.listpokemon.page.toofew', $.userPrefix(sender), Math.ceil(pokemonKeys.length/ numberPerPage), pokemonKeys.length));
				return;
			}
			
			outputDialogue=$.lang.get('pokemonsystem.listpokemon.page.start', $.userPrefix(sender), pageNumber, Math.ceil(pokemonKeys.length / numberPerPage), pokemonKeys.length);

			var firstTime=true;
			var counter=0;

//			for (i=((pageNumber-1)*numberPerPage);(i < pokemonKeys.length && i < (pageNumber * numberPerPage) );i++)
			
			for (i in pokemonKeys)
			{
				if (counter < ( (pageNumber-1) * numberPerPage) )
				{
					// do nothing;  simply putting this here to make the loop faster.
				}
				else if ( counter >= (pageNumber * numberPerPage) )
				{
					$.say(outputDialogue);
					return;
				}
				else 
				{
					if (!firstTime)
					{
						outputDialogue=outputDialogue+"; ";
					}
					var pokemonId = pokemonKeys[i].split('_')[1]					
					outputDialogue=outputDialogue+buildpokemonlistdetail(sender,pokemonId, counter+1);
					firstTime=false;
				}
				counter++;
				
//			var pokemonId = pokemonKeys[i].split('_')[1]					
//			var pokemon = getPokemon(pokemonid);			
//			replace(pokemon)  <--- pokemon name
//
//           if (pokemon.includes('+1') || pokemon.includes('+2')) {
//                rare = $.lang.get('pokemonsystem.rarecheck');
//            }
			}
			// We fell out while iterating;  we checked above that we had enough. So we have a partial page.
			$.say(outputDialogue);

		}
		else
		{
			$.say($.lang.get('pokemonsystem.listpokemon.null', $.userPrefix(sender)));
		}
	}
	
	
    /**
    * @function getTeam
    * @param pokemon
    * @return pokemon with that id
    */
    function getTeam(username) {
    var team = $.inidb.GetKeyList('team', username.toLowerCase());
    var monsters = [];
      for (i in team) {
        monsters.push(replace($.lang.get('pokemonsystem.pokemon.' + team[i])));
      }
    var theteam = team.join(', ');
          if (team.length >= 1) {
          $.say($.lang.get('pokemonsystem.team.get',  $.userPrefix(username), monsters.join(', ')));
          return;
      } else {
          $.say($.lang.get('pokemonsystem.team.404'));
          return;
      }
  };

    /**
    * @function delTeam
    * @param pokemon
    * @return pokemon with that id
    */
    function delTeam(sender, action) {
      if (!$.inidb.HasKey('team', sender.toLowerCase(), action)) {
        $.say($.userPrefix(sender) + $.lang.get('pokemonsystem.team.kick404'));
        return;
      } else {
        $.inidb.RemoveKey('team', sender.toLowerCase(), action);
        $.say($.userPrefix(sender) + $.lang.get('pokemonsystem.team.kick', replace(getPokemon(action))));
        return;
      }
    };
	
	
	function getIdForPokemonName(searchName)
	{
		var maxId=parseInt($.lang.get('pokemonsystem.maxpokemonid'));
		for ( var i = 1; i < maxId ; i++)
		{
			if ($.lang.exists('pokemonsystem.pokemon.'+i))
			{
				var splitArray=$.lang.get('pokemonsystem.pokemon.'+i).split(' ');
				var pokemonName=splitArray[splitArray.length-1];
				if (pokemonName.equalsIgnoreCase(searchName))
				{
					return i;
				}
			}
		}
		return 0;
	}
	
	function wipePokemonEntries(sender, username)
	{
		if (! $.isAdmin(sender))
		{
			$.say('Sorry!  This command is limited to channel admins and higher.');
			return;
		}
		$.say('Wiping things out in pokemon system for [' + username + ']');
		
		$.inidb.RemoveSection('team', username);
		$.inidb.del('powners', username);
		
		$.inidb.RemoveFile(username + '_plist');
		$.inidb.RemoveFile(username + '_pokemon');
		$.inidb.RemoveFile(username + '_shinylist');
		
		$.say('Hopefully successful in wiping out pokemon system for [' + username + ']');

	}
	
	
	function findPokemonId(sender,action)
	{
		var pokemonId=getIdForPokemonName(action);
		if (pokemonId > 0)
		{
			$.say($.lang.get('pokemonsystem.pokefindid.found',action,pokemonId,$.userPrefix(sender)));
			return;
		}
		$.say($.lang.get('pokemonsystem.pokefindid.notfound',action,$.userPrefix(sender)));
		return;
	}
	
	
	function isActionNumeric(action)
	{
		if (typeof action == 'undefined')
		{
			return false;
		}
		if (action === 0)
		{
			return true;  
		}
		if (isNaN(action))
		{
			return false;
		}
		return true;
	}
	
	function ensureId(action)
	{
		if (isActionNumeric(action))
		{
			return parseInt(action);
		}
		return getIdForPokemonName(action);
	}
	

    /**
    * @function replace
    * @param string
    * @return string
    */
    function replace(string) {
      if (string.includes('+2')) {
        return (string.replace('+2', $.lang.get('pokemonsystem.legendary')));
      }
        return (string.replace('+1', $.lang.get('pokemonsystem.rare')));
      }

    /**
    * @event command
    */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        if (command.equalsIgnoreCase('pokedex')) {
            if (!action) {
                randompokemon(sender);
                return;
            }
            checkpokemon(sender, action);
        }
		if (command.equalsIgnoreCase('pokelist')) {
			if (!action) {
				
				listpokemon(sender, 1);
			}
			else
			{
				listpokemon(sender, ensureId(action));
			}
			return;
		}
		if (command.equalsIgnoreCase('pokemonwipedata'))
		{
			wipePokemonEntries(sender,action);
			return;
		}
		
		
		if (command.equalsIgnoreCase('pokefindid')) {
			if (!action)
			{
				$.say($.lang.get('pokemonsystem.pokefindid.null'));
			}
			else
			{
				findPokemonId(sender,action);
			}
			return;
        }


        if (command.equalsIgnoreCase('pokeballgo')) {
            catchPokemon(sender);
        }

        if (command.equalsIgnoreCase('sendpokemon')) {
            sendPokemon(sender, action, subAction)
        }

        if (command.equalsIgnoreCase('buypokemon')) {
            buyPokemon(event, sender, action, subAction);
        }

        if (command.equalsIgnoreCase('pokemon')) {
            checkpokemons(sender);
        }

        if (command.equalsIgnoreCase('setpokemon')) {
            setPokemon(sender, ensureId(action));
        }

        if (command.equalsIgnoreCase('unsetpokemon')) {
            if (getpowners(sender)) {
                $.inidb.del('powners', sender.toLowerCase());
                $.say($.lang.get('pokemonsystem.split.success', $.userPrefix(sender)));
                return;
            }
            $.say($.lang.get('pokemonsystem.split.404', $.userPrefix(sender)));
        }

        if (command.equalsIgnoreCase('battle')) {
            startBattle(sender, action);
        }

        if (command.equalsIgnoreCase('team')) {
            getTeam(sender);
        }

        if (command.equalsIgnoreCase('addteam')) {
            if (action === undefined) {
                $.say($.lang.get('pokemonsystem.addteam.usage'));
                return;
            } else {
              addTeam(sender, ensureId(action));
            }
        }
        if (command.equalsIgnoreCase('kickteam')) {
            if (action === undefined) {
                $.say($.lang.get('pokemonsystem.kickteam.usage'));
                return;
            } else {
              delTeam(sender, ensureId(action));
            }
        }

        if (command.equalsIgnoreCase('resetteam')) {
            $.inidb.RemoveSection('team', sender.toLowerCase());
            $.say($.userPrefix(sender) + $.lang.get('pokemonsystem.team.reset'));
            return;
        }
        if (command.equalsIgnoreCase('pokemonhelp')) {
            $.say($.userPrefix(sender) + $.lang.exists('pokemonsystem.pokemonhelp'));
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./games/pokemonSystem.js')) {
            loadpokemons();
            loadResponses();
            $.registerChatCommand('./games/pokemonSystem.js', 'pokemon');
            $.registerChatCommand('./games/pokemonSystem.js', 'pokedex');
            $.registerChatCommand('./games/pokemonSystem.js', 'pokelist');
            $.registerChatCommand('./games/pokemonSystem.js', 'pokeballgo');
            $.registerChatCommand('./games/pokemonSystem.js', 'sendpokemon');
            $.registerChatCommand('./games/pokemonSystem.js', 'unsetpokemon');
            $.registerChatCommand('./games/pokemonSystem.js', 'setpokemon');
            $.registerChatCommand('./games/pokemonSystem.js', 'buypokemon');
            $.registerChatCommand('./games/pokemonSystem.js', 'battle');
            $.registerChatCommand('./games/pokemonSystem.js', 'team');
            $.registerChatCommand('./games/pokemonSystem.js', 'addteam');
            $.registerChatCommand('./games/pokemonSystem.js', 'kickteam');
            $.registerChatCommand('./games/pokemonSystem.js', 'resetteam');
            $.registerChatCommand('./games/pokemonSystem.js', 'pokemonhelp');
            $.registerChatCommand('./games/pokemonSystem.js', 'pokefindid');
			$.registerChatCommand('./games/pokemonSystem.js', 'pokemonwipedata');

        }
    });
})();
