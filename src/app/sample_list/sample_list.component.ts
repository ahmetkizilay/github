import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleLibraryService } from '../sample-library.service';
import { map } from 'rxjs';
import { AudioService } from '../audio.service';

interface SampleItem {
  name: string;
};

@Component({
  selector: 'app-sample-list',
  standalone: true,
  imports: [CommonModule],
  template: `
<div>
<label>SAMPLES</label>
<ul class="samples">
  <li *ngFor="let sample of samples$ | async" class="sample">
    <div>
      <label>{{sample.name}}</label>
      <button class="material-symbols-outlined play"
        title="Play sample"
        (click)="playSample(sample.name)">play_arrow</button>
    </div>
  </li>
</ul>
</div>
  `,
  styleUrls: ['./sample_list.component.css']
})
export class SampleListComponent {
  private sampleLibrary: SampleLibraryService = inject(SampleLibraryService);
  private audioService: AudioService = inject(AudioService);

  samples$ = this.sampleLibrary.samples$.pipe(map(samples => {
    return samples.map(sample => {
      return {
        name: sample.name,
      };
    });
  }));

  playSample(sample: string) {
    this.audioService.playSample(sample);
  }
}
