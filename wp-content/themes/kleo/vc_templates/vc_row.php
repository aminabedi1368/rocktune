<?php
$output = '';
extract(shortcode_atts(array(
    'front_status' => '',
		'inner_container' => 'yes',
		'text_align' => '',
		'section_type' => 'main',
		'type' => '',
		'text_color' => '',
		'bg_color' => '',
		'bg_image' => '',
		'bg_position' => '',
		'bg_position_horizontal' => '',
		'bg_repeat' => '',
		'bg_cover' => '',
		'bg_attachment' => 'false',

		'bg_video_src_mp4' => '',
		'bg_video_src_ogv' => '',
		'bg_video_src_webm' => '',
        'bg_video_cover' => '',
        'column_gap' => '',
        'vertical_align' => '',
		'padding_top' => '',
		'padding_bottom' => '',
		'padding_left' => '',
		'padding_right' => '',
		'margin_top' => '',
		'margin_bottom' => '',
		'border' => '',
		'min_height' => '',
		'animation' => '',
		'css_animation' => '',
		'parallax_speed' => '',
		'enable_parallax' => '',
		'video_mute' => '',
		'video_autoplay' => 'true',
		'inline_style' => '',
		'visibility' => '',
		'overflow' => '',
		'el_class' => '',
        'el_id' => ''
), $atts));

if ( $front_status == 'draft' ) {
  return false;
}

$section_classes = array( 'container-wrap', $section_type.'-color' );
if( $el_class != '' ) {
	$section_classes[] = $el_class;
}

switch ( $inner_container ) {
  case 'yes' :
    $container_start = '<div class="section-container container"><div class="row">';
    $container_end   = '</div></div>';
    break;
  default :
    $container_start = '<div class="section-container container-full"><div class="row">';
    $container_end   = '</div></div>';
}

$bg_video = '';
$video_output = '';
$data_attr = '';
$style = array();

if ($text_color != '') {
	$style[] = 'color: '.$text_color;
	$section_classes[] = 'custom-color';
}


switch ($type) {
	case 'color':

		if ( $bg_color ) {
			$style[] = 'background-color: ' . $bg_color;
		}
		break;
		
	case 'image':
		
		$bg_cover = apply_filters( 'kleo_sanitize_flag', $bg_cover );
		$bg_attachment = in_array( $bg_attachment, array( 'false', 'fixed', 'true' ) ) ? $bg_attachment : 'false';


		if ( $bg_image && !in_array( $bg_image, array('none') ) ) {
			$bg_image_path = wp_get_attachment_image_src($bg_image, 'full');
			$style[] = 'background-image: url(' . esc_url($bg_image_path[0]) . ')';
		}

		$position = array();
		if ( $bg_position && $bg_position != '') {
			$position[] = $bg_position;
		}
		if ( $bg_position_horizontal && $bg_position_horizontal != 'left' ) {
			$position[] = $bg_position_horizontal;
		}
		if ( !empty( $position ) ) {
			$style[] = 'background-position: ' . join(' ', $position);
		}
		

		if ( $bg_repeat ) {
			$style[] = 'background-repeat: ' . $bg_repeat;
		}

		if ( 'false' != $bg_attachment ) {
			$style[] = 'background-attachment: fixed';
		} else {
			$style[] = 'background-attachment: scroll';
		}

		if ( 'false' != $bg_cover ) {
			$style[] = 'background-size: cover';
		} else {
			$style[] = 'background-size: auto';
		}
		
		if ( '' != $parallax_speed && $enable_parallax ) {

			$parallax_speed = floatval($parallax_speed);
			if ( false == $parallax_speed ) {
				$parallax_speed = 10;
			}

			$section_classes[] = 'bg-parallax';
			$data_attr = ' data-prlx-speed="' . $parallax_speed . '"';
		}
	
		break;
		
	case 'video':

		// video bg
		$bg_video_args = array();

		if ( $bg_video_src_mp4 ) {
			$bg_video_args['mp4'] = $bg_video_src_mp4;
		}

		if ( $bg_video_src_ogv ) {
			$bg_video_args['ogv'] = $bg_video_src_ogv;
		}

		if ( $bg_video_src_webm ) {
			$bg_video_args['webm'] = $bg_video_src_webm;
		}

		if ( !empty($bg_video_args) ) {
			$attr_strings = array(
				'loop',
				'preload="1"',
				'autoplay=""',
				'muted="muted"'
			);
			if ($video_mute) {
				//$attr_strings[] = 'muted="muted"';
			}
			if ($video_autoplay) {
				//$attr_strings[] = 'autoplay=""';
			}
			
			if ( $bg_video_cover && !in_array( $bg_video_cover, array('none') ) ) {
				$bg_video_path = wp_get_attachment_image_src($bg_video_cover, 'kleo-full-width');
				$attr_strings[] = 'poster="' . esc_url($bg_video_path[0]) . '"';
			}

			$bg_video .= sprintf( '<div class="video-wrap"><video %s class="full-video" webkit-playsinline>', join( ' ', $attr_strings ) );

			$source = '<source type="%s" src="%s" />';
			foreach ( $bg_video_args as $video_type=>$video_src ) {

				$video_type = wp_check_filetype( $video_src, wp_get_mime_types() );
				$bg_video .= sprintf( $source, $video_type['type'], esc_url( $video_src ) );

			}

			$bg_video .= '</video></div>';

			$section_classes[] = 'bg-full-video no-video-controls';
		}
		break;

	default:
		break;
}

if ( $column_gap == 'no' ) {
    $section_classes[] = 'no-col-gap';
}
if ( $vertical_align == 'yes' ) {
    $section_classes[] = 'vertical-col';
}

if( $padding_top != '' ) {
    $style[] = 'padding-top: '.(preg_match('/(px|em|\%|pt|cm)$/', $padding_top) ? $padding_top : $padding_top.'px');
}
if( $padding_bottom != '' ) {
    $style[] = 'padding-bottom: '.(preg_match('/(px|em|\%|pt|cm)$/', $padding_bottom) ? $padding_bottom : $padding_bottom.'px');
}
if( $padding_left != '' ) {
    $style[] = 'padding-left: '.(preg_match('/(px|em|\%|pt|cm)$/', $padding_left) ? $padding_left : $padding_left.'px');
}
if( $padding_right != '' ) {
    $style[] = 'padding-right: '.(preg_match('/(px|em|\%|pt|cm)$/', $padding_right) ? $padding_right : $padding_right.'px');
}
if( $margin_top != '' ) {
    $style[] = 'margin-top: '.(preg_match('/(px|em|\%|pt|cm)$/', $margin_top) ? $margin_top : $margin_top.'px');
}
if( $margin_bottom != '' ) {
    $style[] = 'margin-bottom: '.(preg_match('/(px|em|\%|pt|cm)$/', $margin_bottom) ? $margin_bottom : $margin_bottom.'px');
}
if( $min_height != '' ) {
    $style[] = 'min-height: '.(preg_match('/(px|em|\%|pt|cm)$/', $min_height) ? $min_height : $min_height.'px');
}

switch ( $border ) {
	case 'top' :
		$border = ' border-top';
		break;
	case 'left' :
		$border = ' border-left';
		break;
	case 'right' :
		$border = ' border-right';
		break;
	case 'bottom' :
		$border = ' border-bottom';
		break;
	case 'vertical' :
		$border = ' border-top border-bottom';
		break;
	case 'horizontal' :
		$border = ' border-left border-right';
		break;
	case 'all' :
		$border = ' border-top border-left border-right border-bottom';
		break;
	default :
		$border = '';
}
$section_classes[] = $border;

if ($overflow) {
	$section_classes[] = 'ov-hidden';
}


if ( $inline_style ) {
	$style[] = $inline_style;
}

$style = implode(';', $style);

$video_output .= $bg_video;

	if ( isset($style) ) {
		$style = wp_kses( $style, array() );
		$style = ' style="' . esc_attr($style) . '"';
	} else {
		$style = '';
	}

if ( $animation != '' ) {
	wp_enqueue_script( 'waypoints' );
	$section_classes[] = "animated {$animation} {$css_animation}";
}

if($text_align != '') {
	$section_classes[] = 'text-'.$text_align;
}

if ($visibility != '') {
	$section_classes[] = str_replace(',', ' ', $visibility);
}

$section_id = '';
if ( $el_id != '' ) {
    $section_id = ' id="' . $el_id . '"';
}

$output .= "\n".'<section '. $section_id .'class="'. esc_attr(trim(implode(' ', $section_classes))) .'"' .$data_attr . $style. '>';

$output .= $container_start;
$output .= wpb_js_remove_wpautop($content);
$output .= $container_end;
$output .= $video_output;
$output .= '</section><!-- end section -->';
echo $output;