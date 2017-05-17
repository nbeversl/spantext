<?php
/*
Plugin Name: SpanText
Plugin URI: www.spantext.com
Description: JavaScript Transforming Text
Version: 1.6.1
Author:  Nate Beversluis
Author URI: www.natebeversluis.com
*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

include (dirname(__FILE__) . '/admin/spantext-admin.php');

if ( ! class_exists( 'SpanText' ) ) {
	class SpanText
	{
		protected $tag = 'spantext';
		protected $name = 'SpanText';
		protected $version = '1.6';
		
		public function spantext ()
		{

		
			// Define the URL path to the plugin...
			$plugin_path = plugin_dir_url( __FILE__);
			
		 	 			
			if ( !wp_style_is( $this->tag, 'enqueued' ) ) {
				wp_enqueue_style(
					$this->tag,
					$plugin_path . '/css/spantext.css',
					array(),
					$this->version
				);
			}	
   
			wp_register_script( 'spantext', $plugin_path . '/js/spantext.js', array('jquery'), false,true);
			wp_register_script( 'nouislider', $plugin_path . '/js/spantext-nouislider.js', array(), false,true);

			// Loads SpanText in the footer.
			wp_enqueue_script('nouislider', $plugin_path .  '/js/spantext-nouislider.js', array(), false, true);						
			wp_enqueue_script( 'spantext', $plugin_path . '/js/spantext.js', array('jquery'), false,true);
	
		// The shortcode to make a Slider.
			
     	  add_shortcode('spantext-slider', 'spantext_shortcode_query');

		 function spantext_shortcode_query($atts, $content) {
			    extract(shortcode_atts(array( 
			      'id'=> '0',
				  'min' => '0',
				  'max' => '10',
			 	  'leftlabel' =>'' ,
				  'rightlabel' => '',
				  'leftwardattribute' =>'',
				  'rightwardattribute' => '',
				  'speed' => '1',
				  'initialsetting' => '0'
			  )
			     , $atts));
				  
	  			$displayslider = 
				
								'<div class="spantextslider" id="'.$id.'"
	  							type="input" 
	  							data-spantextmin="'.$min.'"
	  							data-spantextmax="'.$max.'"
	  							data-spantextattrR="'.$rightwardattribute.'" 
	  							data-spantextattrL="'.$leftwardattribute.'"
	  							data-spantextspeed="'.$speed.'"
	  							data-spantextinit="'.$initialsetting.'"
	  							></div>';
						
			return  $displayslider; 							
  		  }

	  }
 		
	}


}
New SpanText;

?>
