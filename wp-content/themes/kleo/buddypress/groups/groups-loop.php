<?php
/**
 * BuddyPress - Groups Loop
 *
 * Querystring is set via AJAX in _inc/ajax.php - bp_legacy_theme_object_filter().
 *
 * @package BuddyPress
 * @subpackage bp-legacy
 */

?>

<?php

/**
 * Fires before the display of groups from the groups loop.
 *
 * @since 1.2.0
 */
do_action( 'bp_before_groups_loop' ); ?>

<?php if ( function_exists( 'bp_get_current_group_directory_type' ) && bp_get_current_group_directory_type() ) : ?>
	<p class="current-group-type"><?php bp_current_group_directory_type_message() ?></p>
<?php endif; ?>

<?php if ( bp_has_groups( bp_ajax_querystring( 'groups' ). '&per_page='.sq_option('bp_groups_perpage', 24) ) ) : ?>

	<?php

	/**
	 * Fires before the listing of the groups list.
	 *
	 * @since 1.1.0
	 */
	do_action( 'bp_before_directory_groups_list' ); ?>


	<ul id="groups-list" class="item-list kleo-isotope masonry" aria-live="assertive" aria-atomic="true" aria-relevant="all">

	<?php while ( bp_groups() ) : bp_the_group(); ?>

		<li <?php bp_group_class(); ?> id="<?php echo 'group-id-'.bp_get_group_id(); ?>">
    	    <div class="group-inner-list animated animate-when-almost-visible bottom-to-top">

				<?php if ( ! bp_disable_group_avatar_uploads() ) : ?>
	                <div class="item-avatar rounded">
						<a href="<?php bp_group_permalink(); ?>"><?php bp_group_avatar( 'type=full&width=80&height=80' ); ?></a>
	                    <span class="member-count"><?php echo preg_replace('/\D/', '', bp_get_group_member_count());  ?></span>
					</div>
				<?php endif; ?>

			<div class="item">
				<div class="item-title"><a href="<?php bp_group_permalink(); ?>"><?php bp_group_name(); ?></a></div>
				
				<?php if(function_exists( 'bp_core_iso8601_date' )) : ?>
					<div class="item-meta"><span class="activity" data-livestamp="<?php bp_core_iso8601_date( bp_get_group_last_active( 0, array( 'relative' => false ) ) ); ?>"><?php printf( __( 'active %s', 'buddypress' ), bp_get_group_last_active() ); ?></span></div>
				<?php else: ?>
					<div class="item-meta"><span class="activity"><?php printf( __( 'active %s', 'buddypress' ), bp_get_group_last_active() ); ?></span></div>
				<?php endif; ?>
				
				<div class="item-desc"><?php bp_group_description_excerpt(); ?></div>

				<?php

				/**
				 * Fires inside the listing of an individual group listing item.
				 *
				 * @since 1.1.0
				 */
				do_action( 'bp_directory_groups_item' ); ?>

			</div>

			<div class="action">

				

				<div class="meta">

					<?php bp_group_type(); ?>

				</div>

				<?php

				/**
				 * Fires inside the action section of an individual group listing item.
				 *
				 * @since 1.1.0
				 */
				do_action( 'bp_directory_groups_actions' ); ?>

			</div>
			</div><!--end group-inner-lis-->
		</li>

	<?php endwhile; ?>

	</ul>

	<?php

	/**
	 * Fires after the listing of the groups list.
	 *
	 * @since 1.1.0
	 */
	do_action( 'bp_after_directory_groups_list' ); ?>

	<div id="pag-bottom" class="pagination">

		<div class="pag-count" id="group-dir-count-bottom">

			<?php bp_groups_pagination_count(); ?>

		</div>

		<div class="pagination-links" id="group-dir-pag-bottom">

			<?php bp_groups_pagination_links(); ?>

		</div>

	</div>

<?php else: ?>

	<div id="message" class="info">
		<p><?php _e( 'There were no groups found.', 'buddypress' ); ?></p>
	</div>

<?php endif; ?>

<?php

/**
 * Fires after the display of groups from the groups loop.
 *
 * @since 1.2.0
 */
do_action( 'bp_after_groups_loop' ); ?>
