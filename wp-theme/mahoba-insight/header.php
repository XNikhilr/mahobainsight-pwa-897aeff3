<?php
/**
 * Header template.
 * @package Mahoba_Insight
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php if ( function_exists( 'wp_body_open' ) ) { wp_body_open(); } ?>

<header class="site-header">
    <div class="container header-inner">
        <div class="site-branding">
            <?php if ( function_exists( 'the_custom_logo' ) && has_custom_logo() ) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <div>
                    <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a></h1>
                    <?php $desc = get_bloginfo( 'description', 'display' ); if ( $desc ) : ?>
                        <p class="site-description"><?php echo esc_html( $desc ); ?></p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>

        <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">☰ Menu</button>

        <nav class="main-nav" id="primary-menu" aria-label="<?php esc_attr_e( 'Primary', 'mahoba-insight' ); ?>">
            <?php
            if ( has_nav_menu( 'primary' ) ) {
                wp_nav_menu( array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'depth'          => 1,
                ) );
            } else {
                echo '<ul>';
                wp_list_categories( array( 'title_li' => '', 'number' => 5, 'orderby' => 'count', 'order' => 'DESC' ) );
                echo '</ul>';
            }
            ?>
        </nav>
    </div>

    <?php $ticker = get_theme_mod( 'mi_ticker_text' ); if ( $ticker ) : ?>
        <div class="ticker" aria-label="<?php esc_attr_e( 'Breaking news', 'mahoba-insight' ); ?>">
            <span class="ticker-label"><?php esc_html_e( 'Breaking', 'mahoba-insight' ); ?></span>
            <span class="ticker-inner"><?php echo esc_html( $ticker ) . ' &nbsp; • &nbsp; ' . esc_html( $ticker ); ?></span>
        </div>
    <?php endif; ?>
</header>

<main id="site-content">