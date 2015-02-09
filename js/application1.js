var flag = 0;
var rowNum = 0;

$(document).ready(function(){
	
	dataDownload();

	$(".acm1").on("click", function(event) {

	    if(flag === 0){
	    	
	    	$("#entrydata").find('tr').find('#last').after('<th id="Total"> Total </th>');
		    $("#entrydata").find('tr').find('#Total').after('<th id="Ranking"> Ranking </th>');

	    	totalFunc();

	    	flag = 1;
	    	$(".acm1").text("Go back to original Table");
	    }
	    else if(flag === 1){
	       	
	    	removeFunc();

	    	flag = 0;      	
	    	$(".acm1").text("Show Total and Ranking");
	    }
	});	
});

function dataDownload(){

	$(function() {

			var dmJSON = "https://hivelab.org/static/students.json";
			
			$.getJSON(dmJSON, function(data) {
			    console.log("hi");
			    $.each(data, function(i, item) {        
			        rowNum = i;
			        var $tr = $('<tr>').append(
			            $('<td>').text(item.Name),
			            $('<td>').text(item.GPA),
			            $('<td>').text(item.GRE_V),
						$('<td>').text(item.GRE_Q),
						$('<td>').text(item.Essay),
						$('<td>').text(item.Recom)
			        ).appendTo('#entrydata tbody');
				});
			});
	});	

}

function totalFunc() {

	var total = 0;
	
	$("#entrydata").find('tr').each(function(){
		var gpa = +$(this).find('td').eq(1).text();
		var grev = +$(this).find('td').eq(2).text();
		var greq = +$(this).find('td').eq(3).text();
		var essay = +$(this).find('td').eq(4).text();
		var recom = +$(this).find('td').eq(5).text();
		
		total = (gpa/4)*40 + (grev/170)*15 + (greq/170)*15 + (essay/5)*20 + (recom/10)*10;
		total = total.toFixed(2);
		$(this).find('td').eq(5).after('<td>'+total+'</td>');
	});
	
	rankFunc();

}

function rankFunc(){

	var totalArray = [];
	var n = 0;
	
	$("#entrydata").find('tr').each(function(){
		totalArray[n] = +$(this).find('td').eq(6).text();
		n = n+1;
		console.log(totalArray);
	});

	for(var j=0; j<n; j++){
		for(var i=0; i < n; i++){
			if(totalArray[i] < totalArray[i+1]){
				var temp = totalArray[i];
				totalArray[i] = totalArray[i+1];
				totalArray[i+1] = temp;
			}
		}		
	}

	$("#entrydata").find('tr').each(function(){
		var totalNum = +$(this).find('td').eq(6).text();

		for(var k=0; k<n-1; k++){
			if(totalArray[k] === totalNum){
				var rank = 0;

				if (totalArray[k] === totalArray[k+1]) {
					rank = k+1;
					k = k+1;
				}
				else {
					rank = k+1;
				}	
			}
		}

		$(this).find('td').eq(6).after('<td>'+rank+'</td>');
	});

	console.log(totalArray);

}

function removeFunc() {
   	$("#entrydata").find('tr').each(function(){
        $(this).find('#Ranking').remove();
        $(this).find('#Total').remove();
        $(this).find('td').eq(7).remove();
        $(this).find('td').eq(6).remove();
	});
}
