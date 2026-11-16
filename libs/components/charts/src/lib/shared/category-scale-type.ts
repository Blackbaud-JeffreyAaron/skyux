/**
 * The scale type for a chart category axis. Use `time` to position date
 * categories by time, so uneven gaps between dates render as proportional
 * distances; otherwise use the default `category` scale, which spaces
 * categories evenly. Only line charts support the `time` scale.
 * @preview
 */
export type SkyChartCategoryScaleType = 'category' | 'time';
