import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Transcription } from './transcription';

describe('Transcription', () => {
  let component: Transcription;
  let fixture: ComponentFixture<Transcription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Transcription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Transcription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
