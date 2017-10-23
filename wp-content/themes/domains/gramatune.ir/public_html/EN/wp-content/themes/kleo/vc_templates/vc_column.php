<?php
$output = $el_class = $width = '';
extract(shortcode_atts(array(
    'font_color'      => '',
    'el_class' => '',
    'width' => '1/1',
    'css' => '',
    'offset' => ''
), $atts));

$el_class = $this->getExtraClass( $el_class );
$width = kleo_translateColumnWidth( $width );
if ( $offset != '' ) {
    $width = $width . ' ' . str_replace( 'vc_', '', $offset );
}
$el_class .= ' wpb_column column_container';
if (version_compare(WPB_VC_VERSION, '4.3.2') >= 0) {
    $style = $this->buildStyle( $font_color );
} else {
    $style = '';
}
$css_class = preg_replace( '/vc_span(\d{1,2})/', 'col-sm-$1', $width . $el_class . vc_shortcode_custom_css_class( $css, ' ' ) );

$output .= "\n\t".'<div class="' . $css_class . '"' . $style . '>';
$output .= "\n\t\t".'<div class="wpb_wrapper">';
$output .= "\n\t\t\t".wpb_js_remove_wpautop($content);
$output .= "\n\t\t".'</div> '.$this->endBlockComment('.wpb_wrapper');
$output .= "\n\t".'</div> '.$this->endBlockComment($el_class) . "\n";

echo $output;