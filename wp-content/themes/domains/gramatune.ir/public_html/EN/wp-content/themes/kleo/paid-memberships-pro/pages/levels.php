<?php
global $wpdb, $pmpro_msg, $pmpro_msgt, $current_user;

$pmpro_levels      = pmpro_getAllLevels( false, true );
$pmpro_level_order = pmpro_getOption( 'level_order' );

/* KLEO ADDED */
$newoptions = sq_option( 'membership' );
/* END - KLEO ADDED */

if ( ! empty( $pmpro_level_order ) ) {
	$order = explode( ',', $pmpro_level_order );

	//reorder array
	$reordered_levels = array();
	foreach ( $order as $level_id ) {
		foreach ( $pmpro_levels as $key => $level ) {
			if ( $level_id == $level->id ) {
				$reordered_levels[] = $pmpro_levels[ $key ];
			}
		}
	}

	$pmpro_levels = $reordered_levels;
} else {
	/* KLEO ADDED */
	$kleo_pmpro_levels_order = isset( $newoptions['kleo_pmpro_levels_order'] ) ? $newoptions['kleo_pmpro_levels_order'] : null;
	$pmpro_levels_sorted     = array();
	$pmpro_levels            = array_filter( $pmpro_levels );

	if ( is_array( $kleo_pmpro_levels_order ) ) {
		asort( $kleo_pmpro_levels_order );

		foreach ( $kleo_pmpro_levels_order as $k => $v ) {
			if ( ! empty( $pmpro_levels[ $k ] ) ) {
				$pmpro_levels_sorted[ $k ] = $pmpro_levels[ $k ];
				unset( $pmpro_levels[ $k ] );
			}
		}
		$pmpro_levels_sorted = $pmpro_levels_sorted + $pmpro_levels;
		$pmpro_levels        = $pmpro_levels_sorted;
	}
	/* END - KLEO ADDED */

}

$pmpro_levels = apply_filters( "pmpro_levels_array", $pmpro_levels );

if ( $pmpro_msg ) {
	?>
	<div class="message <?php echo $pmpro_msgt; ?>"><?php echo $pmpro_msg; ?></div>
	<?php
}
?>
<div class="row membership pricing-table">

	<?php
	$restrict_options = kleo_memberships();

	$levelsno   = count( $pmpro_levels );
	$levelsno   = ( $levelsno == 0 ) ? 1 : $levelsno;
	$level_cols = 12 / $levelsno;

	$popular = $newoptions['kleo_membership_popular'];

	switch ( $level_cols ) {
		case "1":
			$level_cols = "1";
			break;
		case "2":
			$level_cols = "2";
			break;
		case "3":
			$level_cols = "3";
			break;
		case "4":
			$level_cols = "4";
			break;
		case "6":
			$level_cols = "6";
			break;
		case "12":
			$level_cols = "12";
			break;
		default:
			$level_cols = "3";
			break;
	}
	$level_cols = apply_filters( 'kleo_pmpro_level_columns', $level_cols );

	foreach ( $pmpro_levels as $level ) {
		if ( isset( $current_user->membership_level->ID ) ) {
			$current_level = ( $current_user->membership_level->ID == $level->id );
		} else {
			$current_level = false;
		}
		?>

		<div class="col-md-<?php echo $level_cols; ?>">
			<div
				class="panel text-center panel-info kleo-level-<?php echo $level->id; ?><?php if ( $popular == $level->id ) {
					echo ' popular';
				} ?>">
				<div class="panel-heading"><h3><?php echo $level->name; ?></h3></div>
				<div class="panel-body">
					<?php
					if ( pmpro_isLevelFree( $level ) ) {
						$cost_text = "<strong>" . __( "Free", "pmpro" ) . "</strong>";
					} else {
						$cost_text = pmpro_getLevelCost( $level, true, true );
					}
					$expiration_text = pmpro_getLevelExpiration( $level );
					if ( ! empty( $cost_text ) && ! empty( $expiration_text ) ) {
						echo $cost_text . "<br />" . $expiration_text;
					} elseif ( ! empty( $cost_text ) ) {
						echo $cost_text;
					} elseif ( ! empty( $expiration_text ) ) {
						echo $expiration_text;
					}

					?>

					<div class="pmpro-price">
						<p class="lead">
							<?php
							$l_price = explode( ".", pmpro_formatPrice( $level->initial_payment ) );

							if ( pmpro_isLevelFree( $level ) || $level->initial_payment === "0.00" ) {
								echo $l_price[0];

							} else {
								echo $l_price[0];
								if ( isset( $l_price[1] ) ) {
									echo '<sup>.' . $l_price[1] . '</sup>';
								}
							} ?>
						</p>
					</div>

				</div>


				<?php if ( $level->description ) { ?>
					<div class="extra-description"><?php echo $level->description; ?></div>
				<?php } ?>

				<ul class="list-group list-group-flush">
					<?php
					if ( function_exists( 'bp_is_active' ) ) {
						global $kleo_pay_settings;
						foreach ( $kleo_pay_settings as $set ) {
							if ( $restrict_options[ $set['name'] ]['showfield'] != 2 ) { ?>
								<li class="list-group-item <?php if ( $restrict_options[ $set['name'] ]['type'] == 1 || ( $restrict_options[ $set['name'] ]['type'] == 2 && isset( $restrict_options[ $set['name'] ]['levels'] ) && is_array( $restrict_options[ $set['name'] ]['levels'] ) && in_array( $level->id, $restrict_options[ $set['name'] ]['levels'] ) ) ) {
									_e( "unavailable", 'pmpro' );
								} ?>"><?php echo $set['front']; ?></li>
								<?php
							}
						}
					}
					do_action( 'kleo_pmpro_after_membership_table_items', $level );
					?>
				</ul>

				<div class="panel-footer">
					<?php
					$label = __( 'Select', 'pmpro' );
					$href= pmpro_url( "checkout", "?level=" . $level->id, "https" );
					$class = 'btn btn-default';

					if ( empty( $current_user->membership_level->ID ) ) {
						if ( $popular == $level->id ) {
							$class = 'btn btn-highlight';
						}
					} elseif ( ! $current_level ) {
						if ( $popular == $level->id ) {
							$class = 'btn btn-highlight';
						}
					} elseif ( $current_level ) {
						if( pmpro_isLevelExpiringSoon( $current_user->membership_level) && $current_user->membership_level->allow_signups ) {
							$label = __('Renew', 'pmpro');
						} else {
							$class = 'btn btn-disabled';
							$label = __( 'Your&nbsp;Level', 'pmpro' );
							$href  = pmpro_url( "account" );
						}
					}
					?>
					<a class="<?php echo $class; ?>" href="<?php echo $href; ?>"><?php echo $label; ?></a>
				</div>
			</div>
		</div>
		<?php
	}
	?>

</div>


<nav id="nav-below" class="navigation" role="navigation" style="display: inline-block;">
	<div class="nav-previous alignleft">
		<?php if ( ! empty( $current_user->membership_level->ID ) ) { ?>
			<a href="<?php echo pmpro_url( "account" ) ?>"
			   class="btn btn-link"><?php _e( '&larr; Return to Your Account', 'pmpro' ); ?></a>
		<?php } else { ?>
			<a href="<?php echo home_url() ?>" class="btn btn-link"><?php _e( '&larr; Return to Home', 'pmpro' ); ?></a>
		<?php } ?>
	</div>
	<br>&nbsp;<br><br>
</nav>