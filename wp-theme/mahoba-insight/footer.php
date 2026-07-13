<?php
/**
 * Footer template.
 * @package Mahoba_Insight
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
</main><!-- #site-content -->

<footer class="site-footer">
    <div class="container footer-cols">
        <div>
            <h4><?php bloginfo( 'name' ); ?></h4>
            <p><?php bloginfo( 'description' ); ?></p>
            <?php mahoba_insight_render_socials(); ?>
        </div>

        <div class="footer-cats">
            <h4><?php esc_html_e( 'Categories', 'mahoba-insight' ); ?></h4>
            <ul>
                <?php wp_list_categories( array( 'title_li' => '', 'number' => 6, 'orderby' => 'count', 'order' => 'DESC' ) ); ?>
            </ul>
        </div>

        <div class="footer-nav">
            <h4><?php esc_html_e( 'Links', 'mahoba-insight' ); ?></h4>
            <?php
            if ( has_nav_menu( 'footer' ) ) {
                wp_nav_menu( array(
                    'theme_location' => 'footer',
                    'container'      => false,
                    'depth'          => 1,
                ) );
            }
            ?>
        </div>
    </div>

    <div class="container copyright">
        <?php echo wp_kses_post( get_theme_mod( 'mi_footer_copyright', '© ' . date( 'Y' ) . ' ' . get_bloginfo( 'name' ) ) ); ?>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>