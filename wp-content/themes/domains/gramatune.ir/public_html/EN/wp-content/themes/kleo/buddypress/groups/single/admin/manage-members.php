<?php
/**
 * BuddyPress - Groups Admin - Manage Members
 *
 * @package BuddyPress
 * @subpackage bp-legacy
 */

?>

<h2 class="bp-screen-reader-text"><?php _e( 'Manage Members', 'buddypress' ); ?></h2>

<?php

/**
 * Fires before the group manage members admin display.
 *
 * @since 1.1.0
 */
do_action( 'bp_before_group_manage_members_admin' ); ?>

<div aria-live="polite" aria-relevant="all" aria-atomic="true">

	<div class="gap-60"></div>
	<div class="bp-widget">
		<div class="hr-title hr-full"><abbr><?php _e( 'Administrators', 'buddypress' ); ?></abbr></div>

		<?php if ( bp_group_has_members( array( 'per_page' => sq_option('bp_groups_perpage', 24), 'group_role' => array( 'admin' ), 'page_arg' => 'mlpage-admin' ) ) ) : ?>

			<ul id="admins-list" class="item-list single-line">
				<?php while ( bp_group_members() ) : bp_group_the_member(); ?>
					<li>

						<?php bp_group_member_avatar_thumb(); ?>

						<h5>
							<?php bp_group_member_link(); ?>
							<br>
							<small class="joined item-meta">
								<?php bp_group_member_joined_since(); ?>
							</small>
							<?php if ( count( bp_group_admin_ids( false, 'array' ) ) > 1 ) : ?>
								<span class="small">
									<?php if ( count( bp_group_admin_ids( false, 'array' ) ) > 1 ) : ?>
										<a class="button confirm admin-demote-to-member" href="<?php bp_group_member_demote_link(); ?>"><?php _e( 'Demote to Member', 'buddypress' ); ?></a>
									<?php endif; ?>

									<?php

									/**
									 * Fires inside the action section of a member admin item in group management area.
									 *
									 * @since 2.7.0
									 *
									 * @param $section Which list contains this item.
									 */
									do_action( 'bp_group_manage_members_admin_actions', 'admins-list' ); ?>

								</span>
							<?php endif; ?>
						</h5>


						<?php

						/**
						 * Fires inside the item section of a member admin item in group management area.
						 *
						 * @since 1.1.0
						 * @since 2.7.0 Added $section parameter.
						 *
						 * @param $section Which list contains this item.
						 */
						do_action( 'bp_group_manage_members_admin_item', 'admins-list' ); ?>

					</li>
				<?php endwhile; ?>
			</ul>

			<?php if ( bp_group_member_needs_pagination() ) : ?>

				<div class="pagination no-ajax">

					<div id="member-count" class="pag-count">
						<?php bp_group_member_pagination_count(); ?>
					</div>

					<div id="member-admin-pagination" class="pagination-links">
						<?php bp_group_member_admin_pagination(); ?>
					</div>

				</div>

			<?php endif; ?>

		<?php else: ?>

		<div id="message" class="info">
			<p><?php _e( 'No group administrators were found.', 'buddypress' ); ?></p>
		</div>

		<?php endif; ?>
	</div>

	<div class="bp-widget">
		<div class="hr-title hr-full"><abbr><?php _e( 'Moderators', 'buddypress' ); ?></abbr></div>

		<?php if ( bp_group_has_members( array( 'per_page' => sq_option('bp_groups_perpage', 24), 'group_role' => array( 'mod' ), 'page_arg' => 'mlpage-mod' ) ) ) : ?>

			<ul id="mods-list" class="item-list single-line">

				<?php while ( bp_group_members() ) : bp_group_the_member(); ?>
					<li>

						<?php bp_group_member_avatar_thumb(); ?>

						<h5 class="item">
							<?php bp_group_member_link(); ?>
							<br>
							<small><?php bp_group_member_joined_since(); ?></small>

							<span class="small">
								<a href="<?php bp_group_member_promote_admin_link( array( 'user_id' => bp_get_member_user_id() ) ); ?>" class="button confirm mod-promote-to-admin" title="<?php esc_attr_e( 'Promote to Admin', 'buddypress' ); ?>"><?php _e( 'Promote to Admin', 'buddypress' ); ?></a>
								<a class="button confirm mod-demote-to-member" href="<?php bp_group_member_demote_link( bp_get_member_user_id() ); ?>"><?php _e( 'Demote to Member', 'buddypress' ); ?></a>

								<?php

								/**
								 * Fires inside the action section of a member admin item in group management area.
								 *
								 * @since 2.7.0
								 *
								 * @param $section Which list contains this item.
								 */
								do_action( 'bp_group_manage_members_admin_actions', 'mods-list' ); ?>
							</span>
						</h5>


					</li>
				<?php endwhile; ?>

			</ul>

			<?php if ( bp_group_member_needs_pagination() ) : ?>

				<div class="pagination no-ajax">

					<div id="member-count" class="pag-count">
						<?php bp_group_member_pagination_count(); ?>
					</div>

					<div id="member-admin-pagination" class="pagination-links">
						<?php bp_group_member_admin_pagination(); ?>
					</div>

				</div>

			<?php endif; ?>

		<?php else: ?>

			<div id="message" class="info">
				<p><?php _e( 'No group moderators were found.', 'buddypress' ); ?></p>
			</div>

		<?php endif; ?>
	</div>

	<div class="gap-20"></div>

	<div class="bp-widget">
		<div class="hr-title hr-full"><abbr><?php _e("Members", "buddypress"); ?></abbr></div>

		<?php if ( bp_group_has_members( array( 'per_page' => sq_option('bp_groups_perpage', 24), 'exclude_banned' => 0 ) ) ) : ?>

			<ul id="members-list" class="item-list single-line" aria-live="assertive" aria-relevant="all">
				<?php while ( bp_group_members() ) : bp_group_the_member(); ?>

					<li class="<?php bp_group_member_css_class(); ?>">

						<?php bp_group_member_avatar_thumb(); ?>

						<h5>
							<span class="member-name"><?php bp_group_member_link(); ?></span>

							<?php
							if ( bp_get_group_member_is_banned() ) {
								echo ' <span class="banned">';
								_e( '(banned)', 'buddypress' );
								echo '</span>';
							} ?>

							<br>
							<small class="joined item-meta">
								<?php bp_group_member_joined_since(); ?>
							</small>

							<?php

							/**
							 * Fires inside the item section of a member admin item in group management area.
							 *
							 * @since 1.1.0
							 * @since 2.7.0 Added $section parameter.
							 *
							 * @param $section Which list contains this item.
							 */
							do_action( 'bp_group_manage_members_admin_item', 'admins-list' ); ?>

							<span class="member-options">

								<?php if ( bp_get_group_member_is_banned() ) : ?>

									<a href="<?php bp_group_member_unban_link(); ?>" class="button confirm member-unban" title="<?php esc_attr_e( 'Unban this member', 'buddypress' ); ?>"><?php _e( 'Remove Ban', 'buddypress' ); ?></a>

								<?php else : ?>

									<a href="<?php bp_group_member_ban_link(); ?>" class="button confirm member-ban"><?php _e( 'Kick &amp; Ban', 'buddypress' ); ?></a>
									<a href="<?php bp_group_member_promote_mod_link(); ?>" class="button confirm member-promote-to-mod"><?php _e( 'Promote to Mod', 'buddypress' ); ?></a>
									<a href="<?php bp_group_member_promote_admin_link(); ?>" class="button confirm member-promote-to-admin"><?php _e( 'Promote to Admin', 'buddypress' ); ?></a>

								<?php endif; ?>

								<a href="<?php bp_group_member_remove_link(); ?>" class="button confirm"><?php _e( 'Remove from group', 'buddypress' ); ?></a>

								<?php

								/**
								 * Fires inside the action section of a member admin item in group management area.
								 *
								 * @since 2.7.0
								 *
								 * @param $section Which list contains this item.
								 */
								do_action( 'bp_group_manage_members_admin_actions', 'members-list' ); ?>

							</span>
						</h5>

					</li>

				<?php endwhile; ?>
			</ul>

			<?php if ( bp_group_member_needs_pagination() ) : ?>

				<div class="pagination no-ajax">

					<div id="member-count" class="pag-count">
						<?php bp_group_member_pagination_count(); ?>
					</div>

					<div id="member-admin-pagination" class="pagination-links">
						<?php bp_group_member_admin_pagination(); ?>
					</div>

				</div>

			<?php endif; ?>

		<?php else: ?>

			<div id="message" class="info">
				<p><?php _e( 'No group members were found.', 'buddypress' ); ?></p>
			</div>

		<?php endif; ?>
	</div>

</div>

<?php

/**
 * Fires after the group manage members admin display.
 *
 * @since 1.1.0
 */
do_action( 'bp_after_group_manage_members_admin' ); ?>
