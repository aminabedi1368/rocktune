<?php
$posts_query = $el_class = $args = $my_query = $speed = $mode = $swiper_options = '';
$content = $link = $layout = $thumb_size = $link_target = $slides_per_view = $wrap = '';
$autoplay = $hide_pagination_control = $hide_prev_next_buttons = $title = '';
$posts = array();
extract(shortcode_atts(array(
    'el_class' => '',
    'posts_query' => '',
    'autoplay' => 'no',
    'speed' => '',
		'min_items' => 3,
		'max_items' => 6,
		'height' => '',
), $atts));
list($args, $my_query) = vc_build_loop_query($posts_query);

$extra_data = '';

if ( $autoplay == 'yes' ) {
  $extra_data .= ' data-autoplay="true"';
}

if ( $speed ) {
  $extra_data .= ' data-speed="' . $speed . '"';
}

if ( $height != '' ) {
	$extra_data .= ' data-items-height="' . $height . '"';
}

query_posts($args);

if ( have_posts() ) : ?>

	<div class="kleo-carousel-container <?php echo $el_class;?>">
		<div class="kleo-carousel-items kleo-carousel-post" data-min-items="<?php echo $min_items; ?>" data-max-items="<?php echo $max_items;?>"<?php echo $extra_data;?>>
			<ul class="kleo-carousel">

				<?php
				while ( have_posts() ) : the_post();

					get_template_part('page-parts/post-content-carousel');

				endwhile;
				?>

			</ul>
		</div>
		<div class="carousel-arrow">
			<a class="carousel-prev" href="#"><i class="icon-angle-left"></i></a>
			<a class="carousel-next" href="#"><i class="icon-angle-right"></i></a>
		</div> 
		<div class="kleo-carousel-post-pager carousel-pager"></div>
	</div><!--end carousel-container-->

<?php
endif;

// Reset Query
wp_reset_query();