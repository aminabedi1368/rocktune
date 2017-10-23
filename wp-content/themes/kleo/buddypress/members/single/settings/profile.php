<?php
/**
 * BuddyPress - Members Single Profile
 *
 * @package BuddyPress
 * @subpackage bp-legacy
 */

/**
 * Fires before the display of member settings template.
 *
 * @since 1.5.0
 */
do_action( 'bp_before_member_settings_template' ); ?>

	<h2 class="bp-screen-reader-text"><?php
		/* translators: accessibility text */
		_e( 'Profile visibility settings', 'buddypress' );
		?></h2>

<form action="<?php echo trailingslashit( bp_displayed_user_domain() . bp_get_settings_slug() . '/profile' ); ?>" method="post" class="standard-form" id="settings-form">

	<?php
    $field_ids = array();

    if ( bp_xprofile_get_settings_fields() ) : ?>

		<?php while ( bp_profile_groups() ) : bp_the_profile_group(); ?>

			<?php if ( bp_profile_fields() ) : ?>

                <div class="profile-settings" id="xprofile-settings-<?php bp_the_profile_group_slug(); ?>">
                    <div class="title field-group-name col-sm-8">
                        <div class="hr-title hr-full hr-double hr-left"><abbr><?php bp_the_profile_group_name(); ?></abbr></div>
                    </div>
                    <div class="title col-sm-4">
                        <div class="hr-title hr-full hr-double hr-left"><abbr><?php _e( 'Visibility', 'buddypress' ); ?></abbr></div>
                    </div>

                  <?php while ( bp_profile_fields() ) : bp_the_profile_field(); ?>

                    <div class="profile-entry-data">
                      <div <?php bp_field_css_class(); ?>>
                        <div class="field-name col-sm-8"><?php bp_the_profile_field_name(); ?></div>
                        <div class="field-visibility col-sm-4"><?php bp_profile_settings_visibility_select(); ?></div>
                      </div>
                    </div>

                  <?php endwhile; ?>

                </div><!--End profile-settings-->

                <?php $field_ids[] = bp_get_the_profile_group_field_ids(); ?>

			<?php endif; ?>

		<?php endwhile; ?>

	<?php endif; ?>

	<?php

	/**
	 * Fires before the display of the submit button for user profile saving.
	 *
	 * @since 2.0.0
	 */
	do_action( 'bp_core_xprofile_settings_before_submit' ); ?>

	<div class="submit">
		<input id="submit" type="submit" name="xprofile-settings-submit" value="<?php esc_attr_e( 'Save Settings', 'buddypress' ); ?>" class="auto" />
	</div>

	<?php

	/**
	 * Fires after the display of the submit button for user profile saving.
	 *
	 * @since 2.0.0
	 */
	do_action( 'bp_core_xprofile_settings_after_submit' ); ?>

	<?php wp_nonce_field( 'bp_xprofile_settings' ); ?>

	<input type="hidden" name="field_ids" id="field_ids" value="<?php echo join( ',', $field_ids ); ?>" />

</form>

<?php

/**
 * Fires after the display of member settings template.
 *
 * @since 1.5.0
 */
do_action( 'bp_after_member_settings_template' );
