<?php
$grid_link = $grid_layout_mode = $title = $filter= '';
$posts = array();
extract(shortcode_atts(array(
    'title' => '',
    'el_class' => '',
    'orderby' => NULL,
    'order' => 'DESC',
    'loop' => '',
    'post_layout' => 'grid',
    'show_meta' => 'yes'
), $atts));


if( empty( $loop ) ) return;
$this->getLoop( $loop );
$my_query = $this->query;
$args = $this->loop_args;

$el_class = $el_class != "" ? " ".$el_class : ""; 
?>

<?php
	query_posts($args);

	if ( have_posts() ) : ?>

        <?php if ($post_layout == 'grid') : ?>

		    <div class="masonry-listing">
                <div class="grid-posts kleo-isotope masonry<?php echo $el_class;?>">

        <?php else: ?>
            <?php
            if ( $show_meta == 'yes' ){
                $el_class .= ' with-meta';
            } else {
                $el_class .= ' no-meta';
            }

            global $kleo_config;
            if ( $show_meta == 'yes' ) {
                $kleo_config['post_meta_enabled'] = TRUE;
            } else {
                $kleo_config['post_meta_enabled'] = FALSE;
            }
            ?>
            <div class="posts-listing standard-listing<?php echo $el_class;?>">
                <div class="wrap-content">

        <?php endif; ?>


            <?php
            while ( have_posts() ) : the_post();

                if ($post_layout == 'grid') {
                    get_template_part( 'page-parts/post-content-masonry');
                }
                else {
                    get_template_part( 'content', get_post_format() );
                }

            endwhile;
            ?>

		</div>
	</div>

<?php
endif;
// Reset Query
wp_reset_query();