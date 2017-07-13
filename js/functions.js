define( ["jquery"], function($) {
	'use strict';

  var path ="/extensions/PicFlip";

  function setTextCss($element, layout) {
    var numMeasures =  layout.qHyperCube.qMeasureInfo.length;
		var imageSize = $element.find('.qv-extension-picflip-li').css("width");
  	var font_h3 = Math.round((0.65 + 1/numMeasures)*imageSize.slice(0, imageSize.length-2)/10*0.5);
  	var font_h2 = Math.round((0.65 + 1/numMeasures)*imageSize.slice(0, imageSize.length-2)/10);
		var fontSize = [layout.props.fontsizeMeasure1, layout.props.fontsizeMeasure2, layout.props.fontsizeMeasure3];
		var colors = [layout.props.colorMeasure1, layout.props.colorMeasure2, layout.props.colorMeasure3];
		for(var i = 0; i < 3; i++){
			var h3_element = $element.find('.measure' + (i+1) + ' h3');
			var h2_element = $element.find('.measure' + (i+1) + ' h2');
			h3_element.css("font-size", (fontSize[i] != "" ? fontSize[i]*0.5 : font_h3));
			h2_element.css("font-size", (fontSize[i] != "" ? fontSize[i]*1 : font_h2));
			if(colors[i].length != 0){
				h2_element.css("color", "#"+calculateLighterVersion(colors[i], 0.15));
				h3_element.css("color", "#" + colors[i]);
			}
		}
  }

	function flipElement($element, eventType, element, layout){
			var orientation = (layout.props.flipOrientation == "h" ? 'X' : 'Y');
			var newFrontRotation;
			var newBackRotation;
			if($element.isReversed ^ orientation == 'h'){
					newFrontRotation = (eventType == 'mouseleave' ? 180 : 360);
					newBackRotation = (eventType == 'mouseleave' ? 0 : 180);
			} else{
					newFrontRotation = (eventType == 'mouseleave' ? 0 : 180);
					newBackRotation = (eventType == 'mouseleave' ? -180 : 0);
			}
			 $(element).find('.qv-extension-picflip-front').css("transform", "rotate" + orientation + "(" + newFrontRotation + "deg)");
			 $(element).find('.qv-extension-picflip-back').css("transform", "rotate" + orientation + "(" + newBackRotation + "deg)");
		}

  function setUpCss($element, layout){
    removeCss($element, layout);
    setOtherCssWithProperties($element, layout);
		setTextCss($element, layout);
    alignImages($element, layout);
		flipElement($element, 'mouseleave', $element.find('.qv-extension-picflip-flip-container'), layout);
  }

  function setFlipButton($element, layout){
    if(!$element.isLocked){
      $element.isReversed = !($element.isReversed);
      setUpCss($element, layout);
    }
  }

  function setLockButton($element, layout){
    $element.isLocked = !($element.isLocked);
    if($element.isLocked){
			$element.find('.qv-extension-picflip-lockButton').css("background-color", "#da5555");
      $element.find('.qv-extension-picflip-flipButton').css({"background-color": "#ccc"});
    } else {
      $element.find('.qv-extension-picflip-lockButton').css("background-color", "");
      $element.find('.qv-extension-picflip-flipButton').css({"background-color": "#BADA55"});
    }
		setUpCss($element, layout);
  }

  function calculateLighterVersion(color, percent){
    if(color.length == 3){
      var i = 1;
      while(color.length < 7){
        color += color[i];
        i++;
  		}
    } else if(color.length == 7){
      var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
      return ((0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1));
    } else {
      return color;
    }
  }
  function removeCss($element, layout){
    $('.qv-extension-picflip-back-title').removeClass('align-top');
    $('.qv-extension-picflip-back-title').removeClass('align-center');
    $('.qv-extension-picflip-back-title').removeClass('align-bottom');
  }

  function alignImages($element, layout) {
    var verticalAlign = layout.props.textPlacement_vertically;
    $element.find('.qv-extension-picflip-back-title h2, h3').css("padding", "0");
    if(verticalAlign == "top"){
      $element.find('.qv-extension-picflip-back-title').css({
        "position": "absolute",
        "left": "50%", "top": "0%",
        "transform": "translate(-50%, 0%)"
      });
    } else if (verticalAlign == "center"){
      $element.find('.qv-extension-picflip-back-title').css({
        "position": "absolute",
        "left": "50%", "top": "50%",
        "transform": "translate(-50%, -50%)"
      });
    } else if (verticalAlign == "bottom"){
      $element.find('.qv-extension-picflip-back-title').css({
        "position": "absolute",
        "left": "50%", "top": "100%",
        "transform": "translate(-50%, -100%)"
      });
    }
    var textAlignment = layout.props.textAlignment;
    if(textAlignment == "L"){
      $element.find('.qv-extension-picflip-back-title').css({"text-align":"left"});
      $element.find('.qv-extension-picflip-back-title h2, h3').css("padding-left", "5px");
    } else if(textAlignment == "C"){
      $element.find('.qv-extension-picflip-back-title').css({"text-align":"center"});
    } else {
      $element.find('.qv-extension-picflip-back-title').css({"text-align":"right"});
      $element.find('.qv-extension-picflip-back-title h2, h3').css("padding-right", "5px");
    }
  }

function setOtherCssWithProperties($element, layout){
	var containerWidth = $element.find('.qv-extension-picflip-flip-mainContainer').width();
	var containerHeight = $element.find('.qv-extension-picflip-flip-mainContainer').height();
	var padding  = $('.qv-extension-picflip-li').css("padding-top").substring(0, $('.qv-extension-picflip-li').css("padding-top").length-2)*2+1;
	//Use whichever is smaller if there's only one picture to avoid scrolling
	var size = ((layout.props.imageSize == 1 && containerHeight < containerWidth ? containerHeight : containerWidth)/(layout.props.imageSize)) - padding;
  $element.find('.qv-extension-picflip-titleHolder').css("width", $element.find('.qv-extension-picflip-flip-mainContainer').width() - $element.find('.qv-extension-picflip-buttonHolder').width());
  $element.find('.qv-extension-picflip-front').css({"transition": layout.props.flipSpeed + "s", "width": size, "height": size});
  $element.find('.qv-extension-picflip-back').css({"transition": layout.props.flipSpeed + "s", "width": size, "height": size});
	$element.find('.qv-extension-picflip-li').css({"width":size, "height": size});
	$element.find('.qv-extension-picflip-flip-container').css({"width": size, "height":size});
  $element.find('.qv-extension-picflip-back-display').css({"opacity": layout.props.backsideOpacity});



  /** Corner circle*/
	if(layout.props.showCornerCircle){
		var temp = $element.find('.qv-extension-picflip-li').css("width");
		if(temp !== undefined){
			var size = temp.slice(0, temp.length-2);
		}
		$element.find('.qv-extension-picflip-corner-circle').css({
			"color": "#" + layout.props.cornerCircleColor,
			"display": "block",
			"width": size * 0.15,
			"height": size * 0.15,
			"border-radius": size * 0.15 + 10,
			"font-size" : size*0.15 - 10,
			"border" : Math.round(size/100 + 1) + "px solid #" + layout.props.cornerCircleColor,
		});
  } else {
	    $element.find('.qv-extension-picflip-corner-circle').css({"display": "none"});
	}
  if(layout.props.useBoxShadow){
    $element.find('.qv-extension-picflip-corner-circle').css({"box-shadow": "3px 3px 3px rgba(0,0,0,0.3)"});
  } else {
    $element.find('.qv-extension-picflip-corner-circle').css({"box-shadow": ""});
  }

  /**Cropping */
  if(layout.props.cropType == 'cover'){
    $element.find('.qv-extension-picflip-image-display').css({"object-fit": "cover"});
  } else if(layout.props.cropType == 'contain') {
    $element.find('.qv-extension-picflip-image-display').css({"object-fit": "contain"});
  } else {
      $element.find('.qv-extension-picflip-image-display').css({"object-fit": "fill"});
  }

  /** Flipbuttons and Title */
  if(!layout.props.showFlipButtons) {
    $element.find('.qv-extension-picflip-buttonRow').css("display", "none");
  } else {
    $element.find('.qv-extension-picflip-flip-mainContainer').css("height", "100%");
    $element.find('.qv-extension-picflip-flip-mainContainer').css("height", $element.find('.qv-extension-picflip-flip-mainContainer').height()-60);
    $element.find('.qv-extension-picflip-buttonRow').css("display", "block");
		if(!$element.isLocked){
				$element.find(".qv-extension-picflip-flipButton").css({"background-color": "#BADA55"});
				$element.find(".qv-extension-picflip-lockButton").css({"background-color": ""});
		} else {
				$element.find(".qv-extension-picflip-flipButton").css({"background-color": ""});
				$element.find(".qv-extension-picflip-lockButton").css({"background-color": "#da5555"});
		}
  }
}

  return {
    setUpCss : setUpCss,
    setFlipButton : setFlipButton,
    setLockButton : setLockButton,
		flipElement : flipElement
  }

});
