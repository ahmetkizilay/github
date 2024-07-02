import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SampleLibraryService,
  SampleLibraryStatus,
} from '../sample-library.service';
import { filter, first } from 'rxjs';
import { SampleListComponent } from '../sample_list/sample_list.component';
import { TransportComponent } from '../transport/transport.component';
import { TrackComponent } from '../track/track.component';
import { TrackDetailComponent } from '../track_detail/track_detail.component';
import { SceneManager, Track } from '../scene.service';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [
    CommonModule,
    TransportComponent,
    TrackComponent,
    TrackDetailComponent,
    SampleListComponent,
  ],
  template: `
<div style="width: 100%">
  <div>
    <app-transport></app-transport>
    <app-track
      *ngFor="let track of tracks"
      [track]="track"
      (trackSelect)="onTrackSelected($event)"
    ></app-track>
  </div>
  <div class="detail-container" *ngIf="selectedTrack">
    <app-track-detail [track]="selectedTrack"></app-track-detail>
  </div>
</div>
  `,
  styleUrls: ['./scene.component.css'],
})
export class SceneComponent implements OnInit {

  sampleLibraryService: SampleLibraryService = inject(SampleLibraryService);

  tracks: Track[] = [];

  selectedTrack?: Track;

  ngOnInit(): void {
    // One-time subscription to load the template at the beginning.
    this.sampleLibraryService.onStatusChange$
      .pipe(
        filter((state) => state === SampleLibraryStatus.INITIALIZED),
        first()
      )
      .subscribe(async () => {
        await this.loadDefaultTemplate();
      });
  }

  addNewTrack(track: Track) {
    this.tracks.push(track);
  }

  onTrackSelected(selectedTrack: string) {
    this.selectedTrack = this.tracks.find((track) => track.name === selectedTrack);
  }

  private async loadDefaultTemplate() {
    const defaultScene = SceneManager.createDefaultScene();

    defaultScene.tracks.forEach((track: Track) => {
      this.addNewTrack(track);
    });

    // Download the samples for the scene.
    // TODO: Handle errors.
    const downloads = defaultScene.tracks.map((track: Track) => {
      return this.sampleLibraryService.downloadSample({
        name: track.name,
        path: track.params.sampleId,
      });
    });
    await Promise.all(downloads);
  }
}
