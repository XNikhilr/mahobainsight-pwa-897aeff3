<?php
/**
 * Fallback template — used for the blog index and any archive/search
 * that does not have a more specific template.
 *
 * @package Mahoba_Insight
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header(); ?>

<div class="container">

    <?php if ( is_search() ) : ?>
        <h1 class="section-title"><?php printf( esc_html__( 'Search results for: %s', 'mahoba-insight' ), '<em>' . esc_html( get_search_query() ) . '</em>' ); ?></h1>
    <?php elseif ( is_archive() ) : ?>
        <h1 class="section-title"><?php the_archive_title(); ?></h1>
    <?php else : ?>
        <h1 class="section-title"><?php esc_html_e( 'Latest Stories', 'mahoba-insight' ); ?></h1>
    <?php endif; ?>

    <?php if ( have_posts() ) : ?>
        <div class="stories-grid">
            <?php while ( have_posts() ) : the_post(); ?>
                <article <?php post_class( 'story-card' ); ?>>
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
                    <p class="excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></p>
                </article>
            <?php endwhile; ?>
        </div>

        <div class="pagination">
            <?php echo paginate_links(); ?>
        </div>

    <?php else : ?>
        <p><?php esc_html_e( 'Nothing found.', 'mahoba-insight' ); ?></p>
    <?php endif; ?>

</div>

<?php get_footer(); ?>