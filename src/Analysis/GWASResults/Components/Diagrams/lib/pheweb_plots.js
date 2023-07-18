/**
 * PheWeb Manhattan and QQ plots
 * Duplicated from https://github.com/statgen/locuszoom-hosted/blob/c153d3ba465be5b171d073c0aa785e86c1cde109/assets/js/util/pheweb_plots.js
 * MIT LICENSE: https://github.com/statgen/locuszoom-hosted/blob/d726fb23477e36d244c43be87d84b5ed3e1725e7/LICENSE, https://github.com/statgen/pheweb/blob/76f0d0e32ae72e51bc4b259ce4b16edfd653601a/LICENSE
 */
import * as d3 from 'd3-selection';
import * as d3Array from 'd3-array';
// eslint-disable-next-line
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Format from 'd3-format';
import d3Tip from 'd3-tip';
import {
  memoize,
  property,
  range,
  some,
  sortBy,
  template,
  escape,
} from 'lodash'; /* eslint no-unused-vars: 0 */ /* eslint max-len: 0 */ /* eslint no-plusplus: 0 */ /* eslint indent: 0 */ /* eslint spaced-comment: 0 */ /* eslint block-spacing: 0 */ /* eslint prefer-arrow-callback: 0 */ /* eslint space-before-function-paren: 0 */ /* eslint no-multiple-empty-lines: 0 */ /* eslint comma-spacing: 0 */ /* eslint brace-style: 0 */ /* eslint vars-on-top: 0 */ /* eslint quote-props: 0 */ /* eslint no-multi-spaces: 0 */ /* eslint padded-blocks: 0 */ /* eslint object-curly-spacing: 0 */ /* eslint object-curly-newline: 0 */ /* eslint eqeqeq: 0 */ /* eslint space-in-parens: 0 */ /* eslint no-floating-decimal: 0 */ /* eslint prefer-template: 0 */ /* eslint newline-per-chained-call: 0 */ /* eslint object-shorthand: 0 */ /* eslint prefer-rest-params: 0 */ /* eslint prefer-destructuring: 0 */ /* eslint wrap-iife: 0 */ /* eslint arrow-parens: 0 */ /* eslint no-inner-declarations: 0 */ /* eslint func-names: 0 */ // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // --> OFF // Based on https://github.com/statgen/locuszoom-hosted/commit/4c72340981c3e07733fedd14cb3ff479468db5d1#diff-663dda1af63699b00348953ced366f82022b3675c7df72276425a75f27312994R148, and adjusted a bit:

/* eslint camelcase: 0 */ const tooltip_underscoretemplate =  '<div style="background:grey;padding:5px;color:#fff"><b><%- d.chrom %>:<%- d.pos.toLocaleString() %> <%- (d.ref && d.alt) ? (d.ref + "/" + d.alt) : "" %></b><br>p-value: <%- d.pval %><br>Nearest gene(s): <%- d.nearest_genes %></div>';

// NOTE: `qval` means `-log10(pvalue)`.
function fmt(format) {
  // convenience functions- from pheweb common.js
  const args = Array.prototype.slice.call(arguments, 1);
  return format.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
}

function create_gwas_plot(
  variant_bins,
  unbinned_variants_in,
  manhattan_plot_container_id,
) {
  // FIXME: Replace global variables with options object
  // Order from weakest to strongest pvalue, so that the strongest variant will be on top (z-order) and easily hoverable
  // In the DOM, later siblings are displayed over top of (and occluding) earlier siblings.
  const unbinned_variants = sortBy(unbinned_variants_in, function(d) {
    return -Math.log10(d.pval);
  });

  const get_chrom_offsets = memoize(function() {
    const chrom_padding = 2e7;
    const chrom_extents = {};

    const update_chrom_extents = function(variant) {
      if (!(variant.chrom in chrom_extents)) {
        chrom_extents[variant.chrom] = [variant.pos, variant.pos];
      } else if (variant.pos > chrom_extents[variant.chrom][1]) {
        chrom_extents[variant.chrom][1] = variant.pos;
      } else if (variant.pos < chrom_extents[variant.chrom][0]) {
        chrom_extents[variant.chrom][0] = variant.pos;
      }
    };
    variant_bins.forEach(update_chrom_extents);
    unbinned_variants.forEach(update_chrom_extents);

    const chroms = sortBy(Object.keys(chrom_extents), parseInt);

    const chrom_genomic_start_positions = {};
    chrom_genomic_start_positions[chroms[0]] = 0;
    for (let i = 1; i < chroms.length; i++) {
      chrom_genomic_start_positions[chroms[i]] =        chrom_genomic_start_positions[chroms[i - 1]]
        + chrom_extents[chroms[i - 1]][1]
        - chrom_extents[chroms[i - 1]][0]
        + chrom_padding;
    }

    // chrom_offsets are defined to be the numbers that make `get_genomic_position()` work.
    // ie, they leave a gap of `chrom_padding` between the last variant on one chromosome and the first on the next.
    const chrom_offsets = {};
    Object.keys(chrom_genomic_start_positions).forEach(function(chrom) {
      chrom_offsets[chrom] =        chrom_genomic_start_positions[chrom] - chrom_extents[chrom][0];
    });

    return {
      chrom_extents: chrom_extents,
      chroms: chroms,
      chrom_genomic_start_positions: chrom_genomic_start_positions,
      chrom_offsets: chrom_offsets,
    };
  });

  function get_genomic_position(variant) {
    const chrom_offsets = get_chrom_offsets().chrom_offsets;
    return chrom_offsets[variant.chrom] + variant.pos;
  }

  function get_variant_point_id(variant) {
    const chrom = variant.chrom;
    const pos = variant.pos;
    const ref = escape(variant.ref);
    const alt = escape(variant.alt);
    return fmt('variant-point-{0}-{1}-{2}-{3}', chrom, pos, ref, alt);
  }

  function get_y_axis_config(max_data_qval, plot_height, includes_pval0) {
    let possible_ticks = [];
    if (max_data_qval <= 14) {
      possible_ticks = range(0, 14.1, 2);
    } else if (max_data_qval <= 28) {
      possible_ticks = range(0, 28.1, 4);
    } else if (max_data_qval <= 40) {
      possible_ticks = range(0, 40.1, 8);
    } else {
      possible_ticks = range(0, 20.1, 4);
      if (max_data_qval <= 70) {
        possible_ticks = possible_ticks.concat([30, 40, 50, 60, 70]);
      } else if (max_data_qval <= 120) {
        possible_ticks = possible_ticks.concat([40, 60, 80, 100, 120]);
      } else if (max_data_qval <= 220) {
        possible_ticks = possible_ticks.concat([60, 100, 140, 180, 220]);
      } else {
        const power_of_ten = 10 ** Math.floor(Math.log10(max_data_qval));
        const first_digit = max_data_qval / power_of_ten;
        let multipliers;
        if (first_digit <= 2) {
          multipliers = [0.5, 1, 1.5, 2];
        } else if (first_digit <= 4) {
          multipliers = [1, 2, 3, 4];
        } else {
          multipliers = [2, 4, 6, 8, 10];
        }
        possible_ticks = possible_ticks.concat(
          multipliers.map(function(m) {
            return m * power_of_ten;
          }),
        );
      }
    }
    // Include all ticks < qval.  Then also include the next tick.
    // That should mean we'll always have the largest tick >= the largest variant.
    const ticks = possible_ticks.filter(function(qval) {
      return qval < max_data_qval;
    });
    if (ticks.length < possible_ticks.length) {
      ticks.push(possible_ticks[ticks.length]);
    }

    // Use the largest tick for the top of our y-axis so that we'll have a tick nicely rendered right at the top.
    let max_plot_qval = ticks[ticks.length - 1];
    // If we have any qval=inf (pval=0) variants, leave space for them.
    if (includes_pval0) {
      max_plot_qval *= 1.1;
    }
    let scale = d3Scale.scaleLinear().clamp(true);
    if (max_plot_qval <= 40) {
      scale = scale.domain([max_plot_qval, 0]).range([0, plot_height]);
    } else {
      scale = scale
        .domain([max_plot_qval, 20, 0])
        .range([0, plot_height / 2, plot_height]);
    }

    if (includes_pval0) {
      ticks.push(Infinity);
    }

    return {
      scale: scale,
      draw_break_at_20: !(max_plot_qval <= 40),
      ticks: ticks,
    };
  }

  {
    const svg_width = document.getElementById(manhattan_plot_container_id)
      .offsetWidth;
    const svg_height = 550;
    const plot_margin = {
      left: 70,
      right: 30,
      top: 20,
      bottom: 50,
    };
    const plot_width = svg_width - plot_margin.left - plot_margin.right;
    const plot_height = svg_height - plot_margin.top - plot_margin.bottom;

    const gwas_svg = d3
      .select('#' + manhattan_plot_container_id)
      .append('svg')
      .attr('id', 'gwas_svg')
      .attr('width', svg_width)
      .attr('height', svg_height)
      .style('display', 'block')
      .style('margin', 'auto');
    // Improve accessibility by adding a SVG <details> to hold assistive text:
    gwas_svg
      .append('details')
      .text(
        'A chart showing a pheweb visualization. The data is also presented in the table below ',
      );
    const gwas_plot = gwas_svg
      .append('g')
      .attr('id', 'gwas_plot')
      .attr(
        'transform',
        fmt('translate({0},{1})', plot_margin.left, plot_margin.top),
      );

    // Significance Threshold line
    const significance_threshold = 5e-8;
    const significance_threshold_tooltip = d3Tip()
      .attr('class', 'd3-tip')
      .html('Significance Threshold: 5E-8')
      .offset([-8, 0]);
    gwas_svg.call(significance_threshold_tooltip);

    const genomic_position_extent = (function() {
      const extent1 = d3Array.extent(variant_bins, get_genomic_position);
      const extent2 = d3Array.extent(unbinned_variants, get_genomic_position);
      return d3Array.extent(extent1.concat(extent2));
    })();

    const x_scale = d3Scale
      .scaleLinear()
      .domain(genomic_position_extent)
      .range([0, plot_width]);

    const includes_pval0 = some(unbinned_variants, function(variant) {
      return variant.pval === 0;
    }); // in locus-zoom version this was .pvalue

    const highest_plot_qval = Math.max(
      -Math.log10(significance_threshold) + 0.5,
      (function() {
        const best_unbinned_qval = -Math.log10(
          d3Array.min(unbinned_variants, function(d) {
            return d.pval === 0 ? 1 : d.pval;
          }),
        );
        if (best_unbinned_qval !== undefined) {
          return best_unbinned_qval;
        }
        return d3Array.max(variant_bins, function(bin) {
          return d3Array.max(bin, property('qval'));
        });
      })(),
    );

    const y_axis_config = get_y_axis_config(
      highest_plot_qval,
      plot_height,
      includes_pval0,
    );
    const y_scale = y_axis_config.scale;

    // TODO: draw a small y-axis-break at 20 if `y_axis_config.draw_break_at_20`
    const y_axis = d3Axis
      .axisLeft(y_scale)
      .tickFormat(d3Format.format('d'))
      .tickValues(y_axis_config.ticks);
    gwas_plot
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(-8,0)') // avoid letting points spill through the y axis.
      .call(y_axis);

    if (includes_pval0) {
      const y_axis_break_inf_offset =        y_scale(Infinity) + (y_scale(0) - y_scale(Infinity)) * 0.03;
      gwas_plot
        .append('line')
        .attr('x1', -8 - 7)
        .attr('x2', -8 + 7)
        .attr('y1', y_axis_break_inf_offset + 6)
        .attr('y2', y_axis_break_inf_offset - 6)
        .attr('stroke', '#666')
        .attr('stroke-width', '3px');
    }
    if (y_axis_config.draw_break_at_20) {
      const y_axis_break_20_offset = y_scale(20);
      gwas_plot
        .append('line')
        .attr('x1', -8 - 7)
        .attr('x2', -8 + 7)
        .attr('y1', y_axis_break_20_offset + 6)
        .attr('y2', y_axis_break_20_offset - 6)
        .attr('stroke', '#666')
        .attr('stroke-width', '3px');
    }

    gwas_svg
      .append('text')
      .style('text-anchor', 'middle')
      .attr(
        'transform',
        fmt(
          'translate({0},{1})rotate(-90)',
          plot_margin.left * 0.4,
          plot_height / 2 + plot_margin.top,
        ),
      )
      .text('-log\u2081\u2080(p-value)'); // Unicode subscript "10"

    const chroms_and_midpoints = (function() {
      const v = get_chrom_offsets();
      return v.chroms.map(function(chrom) {
        return {
          chrom: chrom,
          midpoint:
            v.chrom_genomic_start_positions[chrom]
            + (v.chrom_extents[chrom][1] - v.chrom_extents[chrom][0]) / 2,
        };
      });
    })();

    const color_by_chrom = d3Scale
      .scaleOrdinal()
      .domain(get_chrom_offsets().chroms)
      .range(['rgb(120,120,186)', 'rgb(0,0,66)']);

    gwas_svg
      .selectAll('text.chrom_label')
      .data(chroms_and_midpoints)
      .enter()
      .append('text')
      .style('text-anchor', 'middle')
      .attr('transform', function(d) {
        return fmt(
          'translate({0},{1})',
          plot_margin.left + x_scale(d.midpoint),
          plot_height + plot_margin.top + 20,
        );
      })
      .text(function(d) {
        return d.chrom;
      })
      .style('fill', function(d) {
        return color_by_chrom(d.chrom);
      });

    gwas_plot
      .append('line')
      .attr('x1', 0)
      .attr('x2', plot_width)
      .attr('y1', y_scale(-Math.log10(significance_threshold)))
      .attr('y2', y_scale(-Math.log10(significance_threshold)))
      .attr('stroke-width', '5px')
      .attr('stroke', 'lightgray')
      .attr('stroke-dasharray', '10,10')
      .on('mouseover', significance_threshold_tooltip.show)
      .on('mouseout', significance_threshold_tooltip.hide);

    // Points & labels
    const tooltip_template = template(tooltip_underscoretemplate);
    const point_tooltip = d3Tip()
      .attr('class', 'd3-tip')
      .html(function(d) {
        return tooltip_template({ d: d });
      })
      .offset([-6, 0]);
    gwas_svg.call(point_tooltip);

    // Add gene name labels to the plot: the 7 most significant peaks, up to 2 gene labels per data point
    // Note: this is slightly different from PheWeb's code (b/c nearest_genes is represented differently)
    const variants_to_label = unbinned_variants
      .slice()
      .filter((v) => !!v.peak && -Math.log10(v.pval) > 7.301) // Only label peaks above line of gwas significance
      .sort((a, b) => -Math.log10(b.pval) - -Math.log10(a.pval)) // most significant first
      .slice(0, 7);
    gwas_plot
      .append('g')
      .attr('class', 'genenames')
      .selectAll('text.genenames')
      .data(variants_to_label)
      .enter()
      .append('text')
      .attr('class', 'genename_text')
      .style('font-style', 'italic')
      .attr('text-anchor', 'middle')
      .attr('transform', function(d) {
        return fmt(
          'translate({0},{1})',
          x_scale(get_genomic_position(d)),
          y_scale(-Math.log10(d.pval)) - 5,
        );
      })
      .text(function(d) {
        // d.nearest_genes is a string, just print as is:
        return d.nearest_genes;
      });

    function pp1() {
      gwas_plot
        .append('g')
        .attr('class', 'variant_hover_rings')
        .selectAll('a.variant_hover_ring')
        .data(unbinned_variants)
        .enter()
        .append('a')
        .attr('class', 'variant_hover_ring')
        .append('circle')
        .attr('cx', function(d) {
          return x_scale(get_genomic_position(d));
        })
        .attr('cy', function(d) {
          return y_scale(-Math.log10(d.pval));
        })
        .attr('r', 7)
        .style('opacity', 0)
        .style('stroke-width', 1)
        .on('mouseover', function(d) {
          //Note: once a tooltip has been explicitly placed once, it must be explicitly placed forever after.
          const target_node = document.getElementById(get_variant_point_id(d));
          point_tooltip.show(d, target_node);
        })
        .on('mouseout', point_tooltip.hide);
    }
    pp1();

    function pp2() {
      gwas_plot
        .append('g')
        .attr('class', 'variant_points')
        .selectAll('a.variant_point')
        .data(unbinned_variants)
        .enter()
        .append('a')
        .attr('class', 'variant_point')
        .append('circle')
        .attr('id', function(d) {
          return get_variant_point_id(d);
        })
        .attr('cx', function(d) {
          return x_scale(get_genomic_position(d));
        })
        .attr('cy', function(d) {
          return y_scale(-Math.log10(d.pval));
        })
        .attr('r', 2.3)
        .style('fill', function(d) {
          return color_by_chrom(d.chrom);
        })
        .on('mouseover', function(d) {
          //Note: once a tooltip has been explicitly placed once, it must be explicitly placed forever after.
          point_tooltip.show(d, this);
        })
        .on('mouseout', point_tooltip.hide);
    }
    pp2();

    function pp3() {
      // drawing the ~60k binned variant circles takes ~500ms.  The (far fewer) unbinned variants take much less time.
      const bins = gwas_plot
        .append('g')
        .attr('class', 'bins')
        .selectAll('g.bin')
        .data(variant_bins)
        .enter()
        .append('g')
        .attr('class', 'bin')
        .attr('data-index', function(d, i) {
          return i;
        }) // make parent index available from DOM
        .each(function(d) {
          //todo: do this in a forEach
          d.x = x_scale(get_genomic_position(d)); // eslint-disable-line no-param-reassign
          d.color = color_by_chrom(d.chrom); // eslint-disable-line no-param-reassign
        });
      bins
        .selectAll('circle.binned_variant_point')
        .data(property('qvals'))
        .enter()
        .append('circle')
        .attr('class', 'binned_variant_point')
        .attr('cx', function(d, i) {
          const parent_i = +this.parentNode.getAttribute('data-index');
          return variant_bins[parent_i].x;
        })
        .attr('cy', function(qval) {
          return y_scale(qval);
        })
        .attr('r', 2.3)
        .style('fill', function(d, i) {
          const parent_i = +this.parentNode.getAttribute('data-index');
          return variant_bins[parent_i].color;
        });
      bins
        .selectAll('circle.binned_variant_line')
        .data(property('qval_extents'))
        .enter()
        .append('line')
        .attr('class', 'binned_variant_line')
        .attr('x1', function(d, i) {
          const parent_i = +this.parentNode.getAttribute('data-index');
          return variant_bins[parent_i].x;
        })
        .attr('x2', function(d, i) {
          const parent_i = +this.parentNode.getAttribute('data-index');
          return variant_bins[parent_i].x;
        })
        .attr('y1', function(d) {
          return y_scale(d[0]);
        })
        .attr('y2', function(d) {
          return y_scale(d[1]);
        })
        .style('stroke', function(d, i) {
          const parent_i = +this.parentNode.getAttribute('data-index');
          return variant_bins[parent_i].color;
        })
        .style('stroke-width', 4.6)
        .style('stroke-linecap', 'round');
    }
    pp3();
  }
}

function create_qq_plot(maf_ranges, qq_ci, qq_plot_container_id) {
  // Escape hatch: for highly filtered datasets ("only the most extreme hits"), it may not be possible to draw a qq
  // plot at all; the backend code clips all values past a cap. This manifests as empty bins, and drawing would fail
  // Physically, this means a QQ plot would be meaningless: ALL the values are *way* more extreme than explained by
  // chance!

  if (!maf_ranges[0].qq.bins.length) {
    document
      .getElementById(qq_plot_container_id)
      .text(
        'No QQ Plot could be generated. It is possible that your data has been filtered to only contain very extreme pvalues, such that a QQ plot would not be meaningful.',
      );
    return;
  }

  maf_ranges.forEach(function(maf_range, i) {
    maf_range.color = ['#e66101', '#fdb863', '#b2abd2', '#5e3c99'][i]; // eslint-disable-line no-param-reassign
  });

  {
    const exp_max = d3Array.max(maf_ranges, function(maf_range) {
      return maf_range.qq.max_exp_qval;
    });
    // Note: we already removed all observed -log10(pvalue)s > ceil(exp_max*2) in python, so we can just use the max observed here.
    let obs_max = d3Array.max(maf_ranges, function(maf_range) {
      return d3Array.max(maf_range.qq.bins, function(bin) {
        return bin[1];
      });
    });
    obs_max = Math.max(obs_max, exp_max);
    obs_max = Math.ceil(obs_max) + 0.01; // The 0.01 makes sure the integer tick will be shown.

    const svg_width = document.getElementById(qq_plot_container_id).offsetWidth;
    const plot_margin = {
      left: 70,
      right: 30,
      top: 10,
      bottom: 120,
    };
    const plot_width = svg_width - plot_margin.left - plot_margin.right;
    // Size the plot to make things square.  This way, x_scale and y_scale should be exactly equivalent.
    const plot_height = (plot_width / exp_max) * obs_max;
    const svg_height = plot_height + plot_margin.top + plot_margin.bottom;

    // TODO: use a clip path to keep qq_ci below the upper edge
    console.log('qq_plot_container_id', qq_plot_container_id);
    const qq_svg = d3
      .select(`#${qq_plot_container_id}`)
      .append('svg')
      .attr('id', 'qq_svg')
      .attr('width', svg_width)
      .attr('height', svg_height)
      .style('display', 'block')
      .style('margin', 'auto');
    const qq_plot = qq_svg
      .append('g')
      .attr('id', 'qq_plot')
      .attr(
        'transform',
        fmt('translate({0},{1})', plot_margin.left, plot_margin.top),
      );

    const x_scale = d3Scale
      .scaleLinear()
      .domain([0, exp_max])
      .range([0, plot_width]);
    const y_scale = d3Scale
      .scaleLinear()
      .domain([0, obs_max])
      .range([plot_height, 0]);

    // "trumpet" CI path
    qq_plot
      .append('path')
      .attr('class', 'trumpet_ci')
      .datum(qq_ci)
      .attr(
        'd',
        d3Shape
          .area()
          .x(function(d) {
            return x_scale(d.x);
          })
          .y0(function(d) {
            return y_scale(d.y_max + 0.05);
          })
          .y1(function(d) {
            return y_scale(Math.max(0, d.y_min - 0.05));
          }),
      )
      .style('fill', 'lightgray');

    // points
    qq_plot
      .append('g')
      .selectAll('g.qq_points')
      .data(maf_ranges)
      .enter()
      .append('g')
      .attr('data-index', function(d, i) {
        return i;
      }) // make parent index available from DOM
      .attr('class', 'qq_points')
      .selectAll('circle.qq_point')
      .data(function(maf_range) {
        return maf_range.qq.bins;
      })
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return x_scale(d[0]);
      })
      .attr('cy', function(d) {
        return y_scale(d[1]);
      })
      .attr('r', 1.5)
      .attr('fill', function(d, i) {
        // Nested selections, d3 v4 workaround
        const parent_index = +this.parentNode.getAttribute('data-index');
        return maf_ranges[parent_index].color;
      });

    const attempt_two_decimals = function(x) {
      if (x === 0) {
        return '0';
      }
      if (x >= 0.01) {
        return x.toFixed(2);
      }
      if (x >= 0.001) {
        return x.toFixed(3);
      }
      return x.toExponential(0);
    };

    // Legend
    qq_svg
      .append('g')
      .attr(
        'transform',
        fmt(
          'translate({0},{1})',
          plot_margin.left + plot_width,
          plot_margin.top + plot_height + 70,
        ),
      )
      .selectAll('text.legend-items')
      .data(maf_ranges)
      .enter()
      .append('text')
      .attr('text-anchor', 'end')
      .attr('y', function(d, i) {
        return i + 'em';
      })
      .text(function(d) {
        return fmt(
          '{0} ≤ MAF < {1} ({2})',
          attempt_two_decimals(d.maf_range[0] || 0),
          attempt_two_decimals(d.maf_range[1] || 0.5), // If MAF values are missing, MAF 0-0.5
          d.count,
        );
      })
      .attr('fill', function(d) {
        return d.color;
      });

    // Axes
    const xAxis = d3Axis
      .axisBottom(x_scale)
      .tickSizeInner(-plot_height) // this approach to a grid is taken from <http://bl.ocks.org/hunzy/11110940>
      .tickSizeOuter(0)
      .tickPadding(7)
      .tickFormat(d3Format.format('d')) //integers
      .tickValues(range(exp_max)); //prevent unlabeled, non-integer ticks.
    qq_plot
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', fmt('translate(0,{0})', plot_height))
      .call(xAxis);

    const y_axis = d3Axis
      .axisLeft(y_scale)
      .tickSizeInner(-plot_width)
      .tickSizeOuter(0)
      .tickPadding(7)
      .tickFormat(d3Format.format('d')) //integers
      .tickValues(range(obs_max)); //prevent unlabeled, non-integer ticks.
    qq_plot
      .append('g')
      .attr('class', 'y axis')
      .call(y_axis);

    qq_svg
      .append('text')
      .style('text-anchor', 'middle')
      .attr(
        'transform',
        fmt(
          'translate({0},{1})rotate(-90)',
          plot_margin.left * 0.4,
          plot_margin.top + plot_height / 2,
        ),
      )
      .text('observed -log\u2081\u2080(p)');

    qq_svg
      .append('text')
      .style('text-anchor', 'middle')
      .attr(
        'transform',
        fmt(
          'translate({0},{1})',
          plot_margin.left + plot_width / 2,
          plot_margin.top + plot_height + 40,
        ),
      )
      .text('expected -log\u2081\u2080(p)');
  }
}

export { create_gwas_plot, create_qq_plot };
