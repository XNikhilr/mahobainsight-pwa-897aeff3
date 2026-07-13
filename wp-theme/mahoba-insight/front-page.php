<?php
/**
 * Front page (one-page news layout).
 * @package Mahoba_Insight
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();

$hero_q = new WP_Query( array( 'posts_per_page' => 1, 'ignore_sticky_posts' => true ) );
?>

<div class="container">

    <?php
    $cats = get_categories( array( 'orderby' => 'count', 'order' => 'DESC', 'number' => 8, 'hide_empty' => 1 ) );
    if ( ! empty( $cats ) ) : ?>
        <nav class="category-chips" aria-label="<?php esc_attr_e( 'Categories', 'mahoba-insight' ); ?>">
            <?php foreach ( $cats as $cat ) : ?>
                <a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>"><?php echo esc_html( $cat->name ); ?></a>
            <?php endforeach; ?>
        </nav>
    <?php endif; ?>

    <?php if ( $hero_q->have_posts() ) : $hero_q->the_post(); ?>
        <section class="hero-story">
            <?php if ( has_post_thumbnail() ) : ?>
                <a href="<?php the_permalink(); ?>" class="hero-image"><?php the_post_thumbnail( 'large' ); ?></a>
            <?php endif; ?>
            <p class="meta">
                <?php $c = get_the_category(); if ( ! empty( $c ) ) : ?>
                    <span class="cat"><?php echo esc_html( $c[0]->name ); ?></span> &nbsp;•&nbsp;
                <?php endif; ?>
                <?php echo esc_html( get_the_date() ); ?>
            </p>
            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
            <p class="excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 32 ) ); ?></p>
        </section>
    <?php endif; wp_reset_postdata(); ?>

    <h2 class="section-title"><?php esc_html_e( 'Latest Stories', 'mahoba-insight' ); ?></h2>

    <?php
    $latest = new WP_Query( array(
        'posts_per_page' => 9,
        'offset'         => 1,
        'ignore_sticky_posts' => true,
    ) );
    if ( $latest->have_posts() ) : ?>
        <div class="stories-grid">
            <?php while ( $latest->have_posts() ) : $latest->the_post(); ?>
                <article class="story-card">
                    <?php if ( has_post_thumbnail() ) : ?>
                        <a href="<?php the_permalink(); ?>" class="thumb"><?php the_post_thumbnail( 'medium_large' ); ?></a>
                    <?php endif; ?>
                    <p class="meta">
                        <?php $c = get_the_category(); if ( ! empty( $c ) ) : ?>
                            <span class="cat"><?php echo esc_html( $c[0]->name ); ?></span> &nbsp;•&nbsp;
                        <?php endif; ?>
                        <?php echo esc_html( get_the_date() ); ?>
                    </p>
                    <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                    <p class="excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 18 ) ); ?></p>
                </article>
            <?php endwhile; ?>
        </div>
    <?php else : ?>
        <p><?php esc_html_e( 'No posts yet. Publish your first story from the WordPress dashboard.', 'mahoba-insight' ); ?></p>
    <?php endif; wp_reset_postdata(); ?>

</div>

<?php get_footer(); ?>