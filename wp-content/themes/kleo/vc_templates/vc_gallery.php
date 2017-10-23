<?php
$output = $title = $type = $onclick = $custom_links = $img_size = $custom_links_target = $images = $el_class  = '';
extract(shortcode_atts(array(
    'title' => '',
    'type' => 'thumbs',
    'grid_number' => '6',
    'onclick' => 'link_image',
    'custom_links' => '',
    'custom_links_target' => '',
    'img_size' => 'thumbnail',
    'images' => '',
    'gap' => '',
    'el_class' => ''
), $atts));

$gal_images = $gal_images_thumb = '';
$link_start = '';
$link_end = '';
$el_start = '';
$el_end = '';
$slides_wrap_start = '';
$slides_wrap_end = '';

$el_class = $this->getExtraClass($el_class);
if ( $type == 'thumbs' ) {
    $slides_wrap_start = '<div class="kleo-gallery-image">';
    $slides_wrap_end = '</div>';
} else if ( $type == 'grid' ) {
    wp_enqueue_script( 'isotope' );
    $slides_wrap_start = '<ul class="responsive-cols per-row-'. $grid_number .' kleo-masonry animate-when-almost-visible one-by-one-general">';
    $slides_wrap_end = '</ul>';
}

//get images
if ( $images == '' ) $images = '-1,-2,-3';

$pretty_rel_random = ' rel="prettyPhoto[rel-'.rand().']"'; //rel-'.rand();

if ( $onclick == 'custom_link' ) { $custom_links = explode( ',', $custom_links); }
$images = explode( ',', $images);
$i = -1;


if ( $type == 'thumbs' ) {
	$gal_images_thumb .= '<div class="kleo-gallery kleo-carousel-container animate-when-almost-visible">'
					. '<div class="kleo-thumbs-carousel kleo-thumbs-animated th-fade" data-min-items=6 data-max-items=6>';
	
	$elem_id = kleo_vc_elem_increment();
	foreach ( $images as $attach_id ) {
			$i++;
			if ($attach_id > 0) {
					$post_thumbnail = wpb_getImageBySize(array( 'attach_id' => $attach_id, 'thumb_size' => $img_size));
			}
			else {
					$different_kitten = 400 + $i;
					$post_thumbnail = array();
					$post_thumbnail['thumbnail'] = '<img src="http://placekitten.com/g/'.$different_kitten.'/300" />';
					$post_thumbnail['p_img_large'][0] = 'http://placekitten.com/g/1024/768';
			}

			$thumbnail = $post_thumbnail['thumbnail'];
			$p_img_large = $post_thumbnail['p_img_large'];
			$link_start = $link_end = '';
			
			$link_start .= '<div id="gall_'.$elem_id.'_'.$i.'">';

			if ( $onclick == 'link_image' ) {
					$link_start .= '<a class="prettyphoto" href="'.$p_img_large[0].'"'.$pretty_rel_random.'>';
					$link_end .= '</a>';
			}
			else if ( $onclick == 'custom_link' && isset( $custom_links[$i] ) && $custom_links[$i] != '' ) {
					$link_start .= '<a href="'.$custom_links[$i].'"' . (!empty($custom_links_target) ? ' target="'.$custom_links_target.'"' : '') . '>';
					$link_end .= '</a>';
			}
			
			$link_end .= '</div>';
			
			$gal_images .= $link_start . '<img src="'.$p_img_large[0].'">' . $link_end;
			
			$gal_images_thumb .= '<a href="#gall_' . $elem_id . '_' . $i . '">' . $thumbnail . kleo_get_img_overlay() . '</a>';
	}
	$gal_images_thumb .= '</div>
									<a class="kleo-thumbs-prev" href="#"><i class="icon-angle-left"></i></a>
                  <a class="kleo-thumbs-next" href="#"><i class="icon-angle-right"></i></a>
									</div>'; 
	
} 
else if ( $type == 'grid' )
{
	foreach ( $images as $attach_id ) {
			$i++;
			if ($attach_id > 0) {
					$post_thumbnail = wpb_getImageBySize(array( 'attach_id' => $attach_id, 'thumb_size' => $img_size ));
			}
			else {
					$different_kitten = 400 + $i;
					$post_thumbnail = array();
					$post_thumbnail['thumbnail'] = '<img src="http://placekitten.com/g/'.$different_kitten.'/300" />';
					$post_thumbnail['p_img_large'][0] = 'http://placekitten.com/g/1024/768';
			}

			$thumbnail = $post_thumbnail['thumbnail'];
			$p_img_large = $post_thumbnail['p_img_large'];
			$link_start = '<li class="el-zero-fade"><div class="kleo-gallery-inner">';
			$link_end = '</div></li>';

			if ( $onclick == 'link_image' ) {
					$link_start .= '<a class="prettyphoto" href="' . $p_img_large[0] . '"' . $pretty_rel_random.'>' . kleo_get_img_overlay();
					$link_end .= '</a>';
			}
			else if ( $onclick == 'custom_link' && isset( $custom_links[$i] ) && $custom_links[$i] != '' ) {
					$link_start .= '<a href="' . $custom_links[$i] . '"' . (!empty($custom_links_target) ? ' target="' . $custom_links_target.'"' : '') . '>' . kleo_get_img_overlay();
					$link_end .= '</a>';
			}
			$gal_images .= $link_start . $thumbnail . $link_end;
	}
}

$css_class =  apply_filters(VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, 'wpb_gallery wpb_content_element'.$el_class.' clearfix', $this->settings['base']);
$output .= "\n\t".'<div class="'.$css_class.'">';
$output .= "\n\t\t".'<div class="wpb_wrapper">';
$output .= wpb_widget_title(array('title' => $title, 'extraclass' => 'wpb_gallery_heading'));

$gap = $gap != '' ? ' kleo-'.$gap.'-gap' : '';

$output .= '<div class="kleo-gallery-container kleo-gallery-' . $type . $gap . '">' . $slides_wrap_start . $gal_images . $slides_wrap_end . $gal_images_thumb . '</div>';
$output .= "\n\t\t".'</div> '.$this->endBlockComment('.wpb_wrapper');
$output .= "\n\t".'</div> '.$this->endBlockComment('.wpb_gallery');

echo $output;