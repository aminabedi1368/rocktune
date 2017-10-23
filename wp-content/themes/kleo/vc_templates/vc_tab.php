<?php
$output = $title = $tab_id = $icon = '';

$default_atts = $this->predefined_atts;
$default_atts['icon'] = '';
extract(shortcode_atts($default_atts, $atts));

$css_class =  apply_filters(VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, 'tab-pane', $this->settings['base']);

$tab_id = empty($tab_id) ? sanitize_title( $title ) : $tab_id;
global $kleo_tab_active;
if ($tab_id == $kleo_tab_active) {
	$css_class .= ' active';
}


$output .= "\n\t\t\t" . '<div id="tab-'. $tab_id .'" class="'.$css_class.'">';
$output .= ($content=='' || $content==' ') ? __("Empty section. Edit page to add content here.", "js_composer") : "\n\t\t\t\t" . wpb_js_remove_wpautop($content);
$output .= "\n\t\t\t" . '</div> ' . $this->endBlockComment('.tab-pane');

echo $output;