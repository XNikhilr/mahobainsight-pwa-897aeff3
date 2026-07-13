<?php
/**
 * Mahoba Insight theme functions.
 *
 * @package Mahoba_Insight
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! defined( 'MAHOBA_INSIGHT_VERSION' ) ) {
    define( 'MAHOBA_INSIGHT_VERSION', '1.0.0' );
}

/**
 * Theme setup.
 */
function mahoba_insight_setup() {
    load_theme_textdomain( 'mahoba-insight', get_template_directory() . '/languages' );

    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array(
        'height'      => 60,
        'width'       => 240,
        'flex-height' => true,
        'flex-width'  => true,
    ) );
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );

    register_nav_menus( array(
        'primary' => __( 'Primary Menu', 'mahoba-insight' ),
        'footer'  => __( 'Footer Menu', 'mahoba-insight' ),
    ) );
}
add_action( 'after_setup_theme', 'mahoba_insight_setup' );

/**
 * Enqueue styles and scripts.
 */
function mahoba_insight_enqueue_assets() {
    // Google Fonts (Inter + Source Serif 4).
    wp_enqueue_style(
        'mahoba-insight-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,700;8..60,900&display=swap',
        array(),
        null
    );

    // Main stylesheet.
    wp_enqueue_style(
        'mahoba-insight-style',
        get_stylesheet_uri(),
        array( 'mahoba-insight-fonts' ),
        MAHOBA_INSIGHT_VERSION
    );

    // Front-end script.
    wp_enqueue_script(
        'mahoba-insight-main',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        MAHOBA_INSIGHT_VERSION,
        true
    );

    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'mahoba_insight_enqueue_assets' );

/**
 * Widget areas.
 */
function mahoba_insight_widgets_init() {
    register_sidebar( array(
        'name'          => __( 'Footer Widgets', 'mahoba-insight' ),
        'id'            => 'footer-1',
        'description'   => __( 'Appears in the footer area.', 'mahoba-insight' ),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ) );
}
add_action( 'widgets_init', 'mahoba_insight_widgets_init' );

/**
 * Customizer settings.
 */
function mahoba_insight_customize_register( $wp_customize ) {
    // Section.
    $wp_customize->add_section( 'mahoba_insight_options', array(
        'title'    => __( 'Mahoba Insight Options', 'mahoba-insight' ),
        'priority' => 30,
    ) );

    // Breaking-news ticker text.
    $wp_customize->add_setting( 'mi_ticker_text', array(
        'default'           => __( 'Welcome to Mahoba Insight — Your daily local & national news brief.', 'mahoba-insight' ),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ) );
    $wp_customize->add_control( 'mi_ticker_text', array(
        'label'       => __( 'Breaking Ticker Text', 'mahoba-insight' ),
        'section'     => 'mahoba_insight_options',
        'type'        => 'text',
        'description' => __( 'Text scrolling in the red bar under the header.', 'mahoba-insight' ),
    ) );

    // Copyright.
    $wp_customize->add_setting( 'mi_footer_copyright', array(
        'default'           => sprintf( __( '© %s Mahoba Insight. All rights reserved.', 'mahoba-insight' ), date( 'Y' ) ),
        'sanitize_callback' => 'wp_kses_post',
    ) );
    $wp_customize->add_control( 'mi_footer_copyright', array(
        'label'   => __( 'Footer Copyright', 'mahoba-insight' ),
        'section' => 'mahoba_insight_options',
        'type'    => 'text',
    ) );

    // Social URLs.
    $socials = array(
        'facebook'  => 'Facebook URL',
        'twitter'   => 'X / Twitter URL',
        'instagram' => 'Instagram URL',
        'youtube'   => 'YouTube URL',
        'whatsapp'  => 'WhatsApp URL',
    );
    foreach ( $socials as $key => $label ) {
        $wp_customize->add_setting( 'mi_social_' . $key, array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
        ) );
        $wp_customize->add_control( 'mi_social_' . $key, array(
            'label'   => __( $label, 'mahoba-insight' ),
            'section' => 'mahoba_insight_options',
            'type'    => 'url',
        ) );
    }
}
add_action( 'customize_register', 'mahoba_insight_customize_register' );

/**
 * Helper: render social links.
 */
function mahoba_insight_render_socials() {
    $keys = array( 'facebook' => 'f', 'twitter' => 'X', 'instagram' => 'IG', 'youtube' => 'YT', 'whatsapp' => 'W' );
    echo '<div class="socials">';
    foreach ( $keys as $key => $label ) {
        $url = get_theme_mod( 'mi_social_' . $key );
        if ( $url ) {
            printf(
                '<a href="%1$s" target="_blank" rel="noopener noreferrer" aria-label="%2$s">%3$s</a>',
                esc_url( $url ),
                esc_attr( ucfirst( $key ) ),
                esc_html( $label )
            );
        }
    }
    echo '</div>';
}

/**
 * Custom excerpt length.
 */
function mahoba_insight_excerpt_length( $length ) { return 22; }
add_filter( 'excerpt_length', 'mahoba_insight_excerpt_length', 999 );

function mahoba_insight_excerpt_more( $more ) { return '&hellip;'; }
add_filter( 'excerpt_more', 'mahoba_insight_excerpt_more' );