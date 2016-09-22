	started = 0;
    score = 0;
    window.myJSON = {};
    window.hiScore = {};
    munilist = "";
    var start_time = new Date();
    weekly = 99999;
    monthly = 99999;
    yearly = 99999;
    hi_time = 10000;
    time_text = 0;
    timerOn = false;
    nick = "";
    muni = "";
    var myVar;
    nick_bad = 0;
    timespan = 366;   // yearly
    munies = 1;     // all
    //    timespans = "<select name='timespan-select'><option value=''>Ajanjakso</option><option value='day'>Päivä</option><option value='month'>Kuukausi</option><option value='year'>Vuosi</option></select>";
    timespans = "<div id='highscore-dropdown-timespan' class='wrapper-dropdown-3'><span>Ajanjakso</span><ul class='dropdown'><li><a href='' onClick='return weekly()'>Viikko</a></li><li><a href='' onClick='return monthly()'>Kuukausi</a></li><li><a href='' onClick='return yearly()'>Vuosi</a></li></ul></div>";

    jQuery(document).ready(function (jQuery) {
		
        if (started == 0) {
            jQuery("#divGamePage").hide();
            jQuery("#divReadyPage").hide();
            jQuery("#highScorePage").hide();
			if(fingame) {

				jQuery.getJSON("http://apps.kunnat.net/json/json_tietovisa.php?jsonp=?", function (json) {
					window.myJSON = json.all;
				});
				jQuery.getJSON("http://apps.kunnat.net/json/get_tietovisa_munis.php?jsonp=?", function (json) {
					munilist_obj = "<div id='select-muni-ddl'><div id='selected-muni' onMouseOver='return dropMuniList();' onMouseOut='return quitMuniList();' >Valitse kunta</div><div id='muni-selector' onMouseOver='return dropMuniList();' onMouseOut='return quitMuniList();'><ul class='dd-munis'>";
					jQuery.each(json, function (index, item) {
						 munilist_obj = munilist_obj + '<li><a href="" onCLick="return selectMuni(\'' + item.fi + '\')">' + item.fi + '</a></li>';
					});
					munilist_obj = munilist_obj + "</ul></div></div>";
					jQuery('#muni-dl').html(munilist_obj);
					jQuery('.dd-munis').hide();
				});
			}
			
			else {

				jQuery.getJSON("http://apps.kunnat.net/json/json_tietovisa_sv.php?jsonp=?", function (json) {
					window.myJSON = json.all;
				});
				jQuery.getJSON("http://apps.kunnat.net/json/get_tietovisa_munis_sv.php?jsonp=?", function (json) {
					munilist_obj = "<div id='select-muni-ddl'><div id='selected-muni' onMouseOver='return dropMuniList();' onMouseOut='return quitMuniList();' >Välj kommun</div><div id='muni-selector' onMouseOver='return dropMuniList();' onMouseOut='return quitMuniList();'><ul class='dd-munis'>";
					jQuery.each(json, function (index, item) {
						 munilist_obj = munilist_obj + '<li><a href="" onCLick="return selectMuni(\'' + item.sv + '\')">' + item.sv + '</a></li>';
					});
					munilist_obj = munilist_obj + "</ul></div></div>";
					jQuery('#muni-dl').html(munilist_obj);
					jQuery('.dd-munis').hide();
				});
			}
			
            jQuery('#highscore-timespan').html(timespans);
        }
    });

    function dropMuniList() {
        timerOn = false;
        jQuery('.dd-munis').show();
    }

    function myMouseOut() {
        if (timerOn)
            jQuery('.dd-munis').hide();
    }

    function quitMuniList() {
        timerOn = true;
        setTimeout("myMouseOut()", 100);
    }

    function selectMuni(munix) {
        muni = munix;
        jQuery('#selected-muni').html(muni);
        jQuery('.dd-munis').hide();
        return false;
    }

    function scoreIt() {
		if(fingame) {
			var stringer = "<h3>Sijoituit seuraavasti</h3><div id='results-table'>";
			stringer = stringer + "<div class='row-underlined'><span class='timespan-spec'>Viikon tulokset</span><span class='position'>sija</span><span class='position-value'>" + weekly + "</span></div>";
			stringer = stringer + "<div class='row-underlined'><span class='timespan-spec'>Kuukauden tulokset</span><span class='position'>sija</span><span class='position-value'>" + monthly + "</span></div>";
			stringer = stringer + "<div class='row-underlined'><span class='timespan-spec'>Vuoden tulokset</span><span class='position'>sija</span><span class='position-value'>" + yearly + "</span></div>";
			stringer = stringer + "</div>";
			jQuery('#divScore').html(stringer);
			console.log(stringer);
		}
		else {
			var stringer = "<h3>Din placering</h3><div id='results-table'>";
			stringer = stringer + "<div class='row-underlined'><span class='timespan-spec'>Veckans resultat</span><span class='position'>plats</span><span class='position-value'>" + weekly + "</span></div>";
			stringer = stringer + "<div class='row-underlined'><span class='timespan-spec'>Månadens resultat</span><span class='position'>plats</span><span class='position-value'>" + monthly + "</span></div>";
			stringer = stringer + "<div class='row-underlined'><span class='timespan-spec'>Årets resultat</span><span class='position'>plats</span><span class='position-value'>" + yearly + "</span></div>";
			stringer = stringer + "</div>";
			jQuery('#divScore').html(stringer);
		}
    }

    function save_close(msg, color) {
        var end_time = new Date();
        elapsedT = end_time - start_time;
        if (elapsedT > 60000)
            elapsedT = 60000;
        jQuery.getJSON("http://apps.kunnat.net/services/get_tietovisa_results.php?score=" + score + "&time=" + elapsedT + "&jsonp=?", function (json) {
            weekly = json.weekly;
            monthly = json.monthly;
            yearly = json.yearly;
        });
        window.setTimeout(function () {
            scoreIt();
        }, 300);
        jQuery("#HrefRestart").attr('href', document.URL);
        jQuery("#HrefRestartHi").attr('href', document.URL);
        jQuery.getJSON("http://apps.kunnat.net/services/save_tietovisa.php?nick=" + nick + "&municipality=" + muni + "&result=" + score + "&time=" + elapsedT + "&jsonp=?", function (json) {
            jQuery("#lblResults").html(json.caller);
        });
        jQuery.getJSON("http://apps.kunnat.net/json/json_tietovisa.php?jsonp=?", function (json) {
            window.myJSON = json.all;
        });
        jQuery("#lblMsg").html(msg);
        jQuery("#lblMsg").css('color', color);
        jQuery('#gotScore').html(score);
    }

    function drop_down_down() {
        jQuery('#highscore-dropdown-timespan .dropdown').show();
        return false;
    }

    function ticktick() {
        time_text = time_text + 1;
        if (time_text > 59) {
            if (started != 0) {
				if(fingame) {
					save_close("Herätys! Aika loppui.", "#c60048");
                }
				else{
					save_close("Vakna! Tiden tog slut.", "#c60048");
				}
				index = 0;
                started = 0;
                jQuery('#divGamePage').hide();
                jQuery('#divReadyPage').show();
                window.clearInterval(myVar);
            }
        } else {
            jQuery(".time-text-secs").html(time_text);
            jQuery("#time-gauge-elapsed").css("width", time_text * 316 / 60);
        }
    }

    function startGameDelay() {
        nick = jQuery("#txtNick").val();
        jQuery.getJSON("http://apps.kunnat.net/services/check_nick.php?nick=" + nick + "&jsonp=?", function (json) {
            nick_bad = json.invalid;
        });
        window.setTimeout("startGame()", 200);
        return false;
    }

    function startGame() {
        nick = jQuery("#txtNick").val();
        if (muni == "") {
			if(fingame) {
				alert('Valitse ensin kunta!');
			}
			else {
				alert('Välj först kommun!');
			}
        }
        else {
			if(fingame) {
				if (nick.length < 3) {
					alert('Nimimerkin pitää olla vähintään kolme merkkiä pitkä!');
					jQuery("#txtNick").focus();
					return false;
				}
				if (nick_bad != 0) {
					alert('Nimimerkin käyttö on estetty. Kokeile toista nimimerkkiä!');
					jQuery("#txtNick").focus();
					return false;
				}
				if (nick == 'Anna nimimerkki') {
					alert('Valitse ensin nimimerkki!');
					jQuery("#txtNick").focus();
				} else {
					jQuery("#divStartPage").hide();
					jQuery("#divReadyPage").hide();
					jQuery('#divGamePage').show();
					jQuery('#btnChoice1Form1').show();
					jQuery('#btnChoice2Form1').show();
					jQuery('#btnChoice3Form1').show();
					jQuery('#btnChoice4Form1').show();
					started = 1;
					index = 0;
					score = 0;
					time_text = 0;
					jQuery('#lblQuestion').html(window.myJSON[index].question);
					jQuery('#btnChoice1Form1').text(window.myJSON[index].choice1);
					jQuery('#btnChoice2Form1').text(window.myJSON[index].choice2);
					jQuery('#btnChoice3Form1').text(window.myJSON[index].choice3);
					jQuery('#btnChoice4Form1').text(window.myJSON[index].choice4);
					jQuery('#btnPass').show();
					jQuery('#btnEasier').show();
					jQuery(".tietovisa-progress").html("<img src='/themes/viku/images/tietovisa/virtuaalikunta_bullets_" + started + ".png' />");
					var start_now = new Date();
					start_time = start_now;
					var myVar = setInterval(function () { ticktick() }, 1000);
				}
			}
			else{
				if (nick.length < 3) {
					alert('Användarnamnet ska ha minst tre tecken!!');
					jQuery("#txtNick").focus();
					return false;
				}
				if (nick_bad != 0) {
					alert('Användernamnet godkändes inte. Försök med ett annat användarnamn.');
					jQuery("#txtNick").focus();
					return false;
				}
				if (nick == 'Användarnamn') {
					alert('Välj först användarnamn!');
					jQuery("#txtNick").focus();
				} else {
					jQuery("#divStartPage").hide();
					jQuery("#divReadyPage").hide();
					jQuery('#divGamePage').show();
					jQuery('#btnChoice1Form1').show();
					jQuery('#btnChoice2Form1').show();
					jQuery('#btnChoice3Form1').show();
					jQuery('#btnChoice4Form1').show();
					started = 1;
					index = 0;
					score = 0;
					time_text = 0;
					jQuery('#lblQuestion').html(window.myJSON[index].question);
					jQuery('#btnChoice1Form1').text(window.myJSON[index].choice1);
					jQuery('#btnChoice2Form1').text(window.myJSON[index].choice2);
					jQuery('#btnChoice3Form1').text(window.myJSON[index].choice3);
					jQuery('#btnChoice4Form1').text(window.myJSON[index].choice4);
					jQuery('#btnPass').show();
					jQuery('#btnEasier').show();
					jQuery(".tietovisa-progress").html("<img src='/themes/viku/images/tietovisa/virtuaalikunta_bullets_" + started + ".png' />");
					var start_now = new Date();
					start_time = start_now;
					var myVar = setInterval(function () { ticktick() }, 1000);
				}
			}
        }
        return false;
    };

    function TryAnswer(choiceMade) {
		if (fingame) {
			if (choiceMade == window.myJSON[index].correct) {
				jQuery('#btnChoice1Form1').show();
				jQuery('#btnChoice2Form1').show();
				jQuery('#btnChoice3Form1').show();
				jQuery('#btnChoice4Form1').show();
				score = score + window.myJSON[index].points;
				jQuery('#litScore').html(score);
				started = started + 1;
				index = index + 1;
				if (started == 13) {
					save_close("Jess! Sait kaikki oikein.", "#080");
					index = 0;
					started = 0;
					jQuery('#divGamePage').hide();
					jQuery('#divReadyPage').show();
					window.clearInterval(myVar);
				} else {
					// still questions
					if (index == 4)
						index = index + 1;  // skip extra question (easy)
					if (index == 9)
						index = index + 1;  // skip extra question (middle)
					jQuery('#lblQuestion').html(window.myJSON[index].question);
					jQuery('#btnChoice1Form1').text(window.myJSON[index].choice1);
					jQuery('#btnChoice2Form1').text(window.myJSON[index].choice2);
					jQuery('#btnChoice3Form1').text(window.myJSON[index].choice3);
					jQuery('#btnChoice4Form1').text(window.myJSON[index].choice4);
					jQuery(".tietovisa-progress").html("<img src='/themes/viku/images/tietovisa/virtuaalikunta_bullets_" + started + ".png' />");
					return false;
				}
			} else {
				save_close("Äh, väärä vastaus! Peli loppui.", "#c60048");
				index = 0;
				// wrong aswer, bail out
				started = 0;
				jQuery('#divGamePage').hide();
				jQuery('#divReadyPage').show();
				window.clearInterval(myVar);
				return false;
			}
		}

		else{
			if (choiceMade == window.myJSON[index].correct) {
				jQuery('#btnChoice1Form1').show();
				jQuery('#btnChoice2Form1').show();
				jQuery('#btnChoice3Form1').show();
				jQuery('#btnChoice4Form1').show();
				score = score + window.myJSON[index].points;
				jQuery('#litScore').html(score);
				started = started + 1;
				index = index + 1;
				if (started == 13) {
					save_close("Bravo! Allt rätt.", "#080");
					index = 0;
					started = 0;
					jQuery('#divGamePage').hide();
					jQuery('#divReadyPage').show();
					window.clearInterval(myVar);
				} else {
					// still questions
					if (index == 4)
						index = index + 1;  // skip extra question (easy)
					if (index == 9)
						index = index + 1;  // skip extra question (middle)
					jQuery('#lblQuestion').html(window.myJSON[index].question);
					jQuery('#btnChoice1Form1').text(window.myJSON[index].choice1);
					jQuery('#btnChoice2Form1').text(window.myJSON[index].choice2);
					jQuery('#btnChoice3Form1').text(window.myJSON[index].choice3);
					jQuery('#btnChoice4Form1').text(window.myJSON[index].choice4);
					jQuery(".tietovisa-progress").html("<img src='/themes/viku/images/tietovisa/virtuaalikunta_bullets_" + started + ".png' />");
					return false;
				}
			} else {
				save_close("Hoppsan, Fel svar! Spelet tog slut.", "#c60048");
				index = 0;
				// wrong aswer, bail out
				started = 0;
				jQuery('#divGamePage').hide();
				jQuery('#divReadyPage').show();
				window.clearInterval(myVar);
				return false;
			}
		}
    }

    function Easify() {
        alternative = (Math.floor(Math.random() * 4) + 1);
        while (alternative == window.myJSON[index].correct)
            alternative = (Math.floor(Math.random() * 4) + 1);
        if (alternative != 1 && window.myJSON[index].correct != 1)
            jQuery('#btnChoice1Form1').hide();
        if (alternative != 2 && window.myJSON[index].correct != 2)
            jQuery('#btnChoice2Form1').hide();
        if (alternative != 3 && window.myJSON[index].correct != 3)
            jQuery('#btnChoice3Form1').hide();
        if (alternative != 4 && window.myJSON[index].correct != 4)
            jQuery('#btnChoice4Form1').hide();
        jQuery('#btnEasier').hide();
        return false;
    }

    function Skipify() {
        if (started < 4)
            window.myJSON[index] = window.myJSON[4];
        else if (started < 8)
            window.myJSON[index] = window.myJSON[9];
        else
            window.myJSON[index] = window.myJSON[14];
        jQuery('#lblQuestion').html(window.myJSON[index].question);
        jQuery('#btnChoice1Form1').show();
        jQuery('#btnChoice2Form1').show();
        jQuery('#btnChoice3Form1').show();
        jQuery('#btnChoice4Form1').show();
        jQuery('#btnChoice1Form1').text(window.myJSON[index].choice1);
        jQuery('#btnChoice2Form1').text(window.myJSON[index].choice2);
        jQuery('#btnChoice3Form1').text(window.myJSON[index].choice3);
        jQuery('#btnChoice4Form1').text(window.myJSON[index].choice4);
        jQuery('#btnPass').hide();
        return false;
    }

    function Quitify() {
		if(fingame) {
			save_close("Höh! Lopetit pelin.", "#c60048");
			index = 0;
			started = 0;
			jQuery('#divGamePage').hide();
			jQuery('#divReadyPage').show();
			return false;
		}
		else{
			save_close("Äsch, du avbröt spelet.", "#c60048");
			index = 0;
			started = 0;
			jQuery('#divGamePage').hide();
			jQuery('#divReadyPage').show();
			return false;
		}
    }

    function grepResults() {
        if (munies == 1)
            munix = "";
        else
            munix = muni;
        jQuery.getJSON("http://apps.kunnat.net/json/get_tietovisa_table.php?timespan=" + timespan + "&muni=" + munix + "&jsonp=?", function (json) {
            table_obj = "<table>";
            jQuery.each(json, function (index, item) {
                table_obj = table_obj + '<tr><td class="hi-pos">' + item.pos + '</td><td class="hi-name">' + item.nick + '</td><td class="hi-score">' + item.score + '</td><td class="hi-time">' + item.time.toFixed(3) + '</td><td class="hi-date">' + item.date + '</td><td class="hi-muni">' + item.city + '</td></tr>';
            });
            table_obj = table_obj + "</table>";
            jQuery('.scrollable').html(table_obj);
        });

    }

    function Weekly() {
        timespan = 7;
        grepResults();
        return false;
    }

    function Monthly() {
        timespan = 31;
        grepResults();
        return false;
        return false;
    }

    function Yearly() {
        timespan = 366;
        grepResults();
        return false;
    }

    function OwnMuni() {
        if(fingame) {
			if (muni == "")
				alert('Et ole valinnut kuntaa');
			else {
				munies = 2;
				grepResults();
			}
		}
		else{
			if (muni == "")
				alert('Du har inte valt kommun');
			else {
				munies = 2;
				grepResults();
			}
		}
		return false;
    }

    function AllMunies() {
        munies = 1;
        grepResults();
        return false;
    }


    function HighScores() {
        jQuery("#divGamePage").hide();
        jQuery("#divReadyPage").hide();
        jQuery("#divStartPage").hide();
        jQuery("#highScorePage").show();
        started = 0;
        timespan = 366;
        munies = 1;
        grepResults();
        return false;
    }

    function clearText(thefield) {
		if(fingame) {
			if (thefield.value == 'Anna nimimerkki')
				thefield.value = "";
		}
		else{
			if (thefield.value == 'Användarnamn')
				thefield.value = "";
		}
    }

    function checkNick(thefield) {
        nick = thefield.value;
        jQuery.getJSON("http://apps.kunnat.net/services/check_nick.php?nick=" + nick + "&jsonp=?", function (json) {
            nick_bad = json.invalid;
        });
        if (nick.length < 3) {
            alert('Nimimerkin pitää olla vähintään kolme merkkiä pitkä!');
            jQuery("#txtNick").focus();
            return false;
        }
        if (nick_bad > 0) {
            alert('Nimimerkin käyttö on estetty. Kokeile toista nimimerkkiä!');
            jQuery("#txtNick").focus();
            return false;
        }
        return true;
    }