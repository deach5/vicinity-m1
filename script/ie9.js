function ie9Trans(section){
	//section.find('.ie9_ani').fadeNext()	
	section.find('.blocker').fadeOut()
	
}
var s15Started = false
function ie9viewing(section){
	



	
	
}



function animateActive(section){
	
//trace('activat11e: ' + section[0].id)


	if(section[0].id ==='section_2'){
		section.find('.ie9_ani').delay(100).animate({left:0},1000)	
	}
	

	if(section[0].id ==='section_3'){
		section.find('.ie9_ani').fadeNext({initDelay:100})	
	}
	
	if(section[0].id ==='section_4'){
		section.find('.ie9_ani').fadeNext({initDelay:500,delay:500})	
	}
	
	if(section[0].id ==='section_5'){
		$('.pointers2',section).fadeNext()	
		$('.aButton',section).fadeNext({animate:{opacity:0}})	
		
		
	}
	
	if(section[0].id ==='section_6'){
		section.find('.ie9_ani').fadeNext({initDelay:100,delay:500})	
	}
	

	
	if(section[0].id ==='section_12'){
		section.find('.ie9_ani').fadeNext({initDelay:500,delay:1000})	
	}
	

	
	if(section[0].id ==='section_14'){
		section.find('.ie9_ani').fadeNext({initDelay:500,delay:1000})	
	}
	
	
	
	
	if(section[0].id ==='section_8'||section[0].id ==='section_9'||section[0].id ==='section_10'||section[0].id ==='section_11'){

		section.find('.ie9_ani').fadeNext()
		section.find('.submitBtn').fadeNext()


	}
	
	if(section[0].id ==='section_13'){

 
	}
	
	
	
		if(section[0].id ==='section_16'){
		section.find('.ie9_ani').fadeNext({initDelay:500})	
	}
	
}