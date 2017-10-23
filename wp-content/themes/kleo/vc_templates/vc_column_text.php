<?php
$output = $el_class = $css_animation = '';

extract(shortcode_atts(array(
    'el_class' => '',
		'lead' => false,
		'font_size' => '',
		'font_weight' => '',
		'animation' => '',
    'css_animation' => ''
), $atts));

$el_class = $this->getExtraClass($el_class);

$css_class = apply_filters(VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG,'kleo_text_column wpb_content_element '.$el_class, $this->settings['base']);

if ( $animation != '' ) {
	wp_enqueue_script( 'waypoints' );
	$css_class .= " animated {$animation} {$css_animation}";
}

if($lead) {
	$css_class .= ' lead';
}

/* Custom inline styles */
$style_inline = '';
$styles = '';

if ( $font_size && (int)$font_size != 0 ) {
	$styles .= ' font-size:' . $font_size . 'px;';
}
if ( $font_weight && $font_weight != 'normal' ) {
	$styles .= ' font-weight:' . $font_weight . ';';
}
if ( $styles != '' ) {
	$style_inline = ' style="' . $styles . '"';
}

$output .= "\n\t".'<div class="'.$css_class.'"' . $style_inline . '>';
$output .= "\n\t\t".'<div class="wpb_wrapper">';
$output .= "\n\t\t\t".wpb_js_remove_wpautop($content, true);
$output .= "\n\t\t".'</div> ' . $this->endBlockComment('.wpb_wrapper');
$output .= "\n\t".'</div> ' . $this->endBlockComment('.wpb_text_column');

echo $output;