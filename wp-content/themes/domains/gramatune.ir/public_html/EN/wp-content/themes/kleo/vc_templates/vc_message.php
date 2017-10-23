<?php
$output = $color = $el_class = $css_animation = '';
extract(shortcode_atts(array(
    'color' => 'alert-info',
    'el_class' => '',
		'animation' => '',
    'css_animation' => ''
), $atts));
$el_class = $this->getExtraClass($el_class);

if ($color == "alert-block") $color = "alert-warning";
$color = ( $color != '' ) ? $color : '';
$css_class = apply_filters(VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, 'alert '.$color.$el_class, $this->settings['base']);

if ( $animation != '' ) {
	wp_enqueue_script( 'waypoints' );
	$css_class .= " animated {$animation} {$css_animation}";
}

$output .= '<div class="'.$css_class.'"><div class="messagebox_text clearfix">'.wpb_js_remove_wpautop($content, true).'</div></div>'.$this->endBlockComment('alert box')."\n";

echo $output;
