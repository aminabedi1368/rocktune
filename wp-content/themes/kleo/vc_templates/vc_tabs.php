<?php
$output = $title = $interval = $el_class = '';
extract(shortcode_atts(array(
    'title' => '',
		'type' => 'tab',
		'active_tab' => '1',
		'style' => 'default',
		'align' => '',
		'margin_top' => '',
        'interval' => 0,
        'position' => '',
        'el_class' => ''
), $atts));


$el_class = $this->getExtraClass($el_class);

$element = 'kleo-tabs';

if ( 'vc_tour' == $this->shortcode ) {
    $element = 'wpb_tour';
}

$align = $align != "" ? " tabs-".$align : "";


if ($type == 'pills') {
	$style = 'square';
}
$style_att = '';
if ($margin_top != '') {
	$style_att .= ' style="margin-top:'.(int)$margin_top.'px"';
}

// Extract tab titles
preg_match_all( '/vc_tab title="([^\"]+)"(\stab_id\=\"([^\"]+)\"){0,1}(\sicon\=\"([^\"]+)\")*/i', $content, $matches, PREG_OFFSET_CAPTURE );
$tab_titles = array();

/**
 * vc_tabs
 *
 */
$i = 1;
global $kleo_tab_active;

$active_tab = (int)$active_tab != 0 ? $active_tab : 1;

if ( isset($matches[0]) ) { $tab_titles = $matches[0]; }
$tabs_nav = '';
$tabs_nav .= '<ul class="nav nav-'.$type.' responsive-'.$type.' '.$type.'-style-'.$style.$align.'">';
foreach ( $tab_titles as $tab ) {
    preg_match('/vc_tab title="([^\"]+)"(\stab_id\=\"([^\"]+)\"){0,1}(\sicon\=\"([^\"]+)\")*/i', $tab[0], $tab_matches, PREG_OFFSET_CAPTURE );
    if(isset($tab_matches[1][0])) {
				$tabid = isset($tab_matches[3][0]) ? $tab_matches[3][0] : sanitize_title( $tab_matches[1][0] );

				$icon = isset($tab_matches[5][0]) ? '<i class="icon-'.$tab_matches[5][0].'"></i> ' : "";
        $tabs_nav .= '<li'.($i == $active_tab ? ' class="active"':'').'><a href="#tab-'. $tabid .'" data-toggle="tab" onclick="return false;">' .$icon. $tab_matches[1][0] . '</a></li>';
				if ($i == $active_tab) {$kleo_tab_active = $tabid;}
    }
		$i++;
}
$tabs_nav .= '</ul>'."\n";

$css_class =  apply_filters(VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, trim($element.' tabbable '.$el_class), $this->settings['base']);

if ( $position != '' ) {
    $css_class .= ' pos-' . $position;
}

$output .= "\n\t".'<div class="' . $css_class . '"' . $style_att . ' data-interval="' . $interval . '">';
//$output .= wpb_widget_title(array('title' => $title, 'extraclass' => $element.'_heading'));
$output .= "\n\t\t\t".$tabs_nav;
$output .= '<div class="tab-content">';
$output .= "\n\t\t\t".wpb_js_remove_wpautop($content);
if ( 'vc_tour' == $this->shortcode ) {
    $output .= "\n\t\t\t" . '<div class="wpb_tour_next_prev_nav clearfix"><small><span class="tour_prev_slide"><a href="#" title="' . __( 'Previous section', 'kleo_framework' ) . '">' .  __( 'Previous section', 'kleo_framework' ) . '</a></span> | <span class="tour_next_slide"><a href="#" title="' . __( 'Next section', 'kleo_framework' ) . '">' . __( 'Next section', 'kleo_framework' ) . '</a></span></small></div>';
}
$output .= '</div>';
$output .= "\n\t".'</div> '.$this->endBlockComment($element);

echo $output;