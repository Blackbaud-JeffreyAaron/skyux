import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartLine,
  SkyChartLineSeries,
  type SkyChartTimeUnit,
} from '@skyux/charts';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

import {
  TEAMS,
  TIME_SCALE_SCENARIOS,
  type TimeScaleScenario,
  timeScaleReadings,
  unitReadings,
} from './chart-line-time-scale-data';

const TIME_UNITS: SkyChartTimeUnit[] = [
  'millisecond',
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'quarter',
  'year',
];

// The settings are kept in the URL so a link opens a specific variant.
@Component({
  imports: [
    FormsModule,
    SkyBoxModule,
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartLine,
    SkyChartLineSeries,
    SkyFluidGridModule,
    SkyInputBoxModule,
    SkyPageModule,
  ],
  selector: 'app-chart-line-time-scale-playground',
  templateUrl: './chart-line-time-scale-playground.html',
})
export default class ChartLineTimeScalePlayground {
  readonly #router = inject(Router);
  readonly #params = toSignal(inject(ActivatedRoute).queryParamMap);

  protected readonly scenarios = Object.entries(TIME_SCALE_SCENARIOS);
  protected readonly timeUnits = TIME_UNITS;
  protected readonly stepSizes = [1, 2, 3, 4, 6];
  protected readonly unitCharts = TIME_UNITS.map((unit) => ({
    unit,
    ...unitReadings(unit),
  }));

  protected readonly scenario = computed(
    () =>
      (this.#params()?.get('scenario') as TimeScaleScenario | null) ?? 'year',
  );

  protected readonly timeUnit = computed(
    () => (this.#params()?.get('unit') as SkyChartTimeUnit | null) ?? 'week',
  );

  protected readonly timeStep = computed(() =>
    Number(this.#params()?.get('step') ?? 1),
  );

  readonly #readings = computed(() => timeScaleReadings(this.scenario()));

  protected readonly dates = computed(() =>
    this.#readings().map((reading) => reading.date),
  );

  protected readonly series = computed(() => [
    {
      labelText: 'Average',
      values: this.#readings().map((reading) => reading.average),
    },
    ...TEAMS.map((team) => ({
      labelText: team,
      values: this.#readings().map((reading) => reading.teams[team]),
    })),
  ]);

  protected setParam(name: string, value: string | number): void {
    void this.#router.navigate([], {
      queryParams: { [name]: value },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
