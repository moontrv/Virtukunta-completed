$(document).ready(function(){

	$.ajax({
        url: 'top5.php',
        }
    });
	
	var test = $.ajax({
        url: 'top5.txt',
        }
    });
	
	console.log(test);
});