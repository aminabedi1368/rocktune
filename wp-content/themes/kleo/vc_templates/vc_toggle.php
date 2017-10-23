<?php
$output = $title = $el_class = $open = $css_animation = $span_closed_data = '';
extract(shortcode_atts(array(
    'title' => __("Click to toggle", "js_composer"),
    'el_class' => '',
    'open' => 'false',
		'icon' => '',
		'icon_closed' => '',
		'icon_position' => 'to-left',
		'tooltip' => '',
		'tooltip_position' => '',
		'tooltip_title' => '',
		'tooltip_text' => '',
		'tooltip_action' => 'hover',
		'animation' => '',
    'css_animation' => ''
), $atts));

$el_class = $this->getExtraClass($el_class);
$css_class = $el_class;

$open = ( $open == 'true' ) ? ' in' : ' collapse';

if ( $animation != '' ) {
	wp_enqueue_script( 'waypoints' );
	$css_class .= " animated {$animation} {$css_animation}";
}

if ($icon != '') {
	$icon = ' icon-'.$icon;
}
if ($icon_closed != '') {
	$icon_closed = ' icon-'.$icon_closed;
} elseif($icon != '') {
	$icon_closed = ' icon-'.$icon;
}

$tooltip_class = '';
$tooltip_data = '';
if($tooltip != '') {
	if ($tooltip == 'popover') {
		$tooltip_class = ' '.$tooltip_action.'-pop';
			$tooltip_data .= ' data-toggle="popover" data-container="body" data-title="'.$tooltip_title.'" data-content="'.$tooltip_text.'" data-placement="'.$tooltip_position.'"';
	} else {
		$tooltip_class .= ' '.$tooltip_action.'-tip';
			$tooltip_data .= ' data-toggle="tooltip" data-original-title="'.$tooltip_title.'" data-placement="'.$tooltip_position.'"';
	}
}

$icon_closed .= $tooltip_class;
$span_closed_data .= $tooltip_data;

if($open == ' in') {
	$icon_closed .= ' hide';
}

$icon_position = $icon_position != '' ? ' icons-'.$icon_position : '';
$css_class .= $icon_position;

$elem_id = kleo_vc_elem_increment();

$output .= '<div class="panel panel-default panel-toggle '.$css_class.'">
		<div class="panel-heading">
			<div class="panel-title">
				<a class="accordion-toggle" data-toggle="collapse" href="#acc-'.$elem_id.'-d">
					'.$title.'
					<span class="icon-closed'.$icon_closed.'"'.$span_closed_data.'></span> 
					<span class="icon-opened'.($open != ' in' ? ' hide ' : ' ').$icon.'"></span>

				</a>
			</div>
		</div>
		<div id="acc-'.$elem_id.'-d" class="panel-collapse'.$open.'">
			<div class="panel-body">'.wpb_js_remove_wpautop($content, true).'</div>
		</div>
	</div>';

echo $output;