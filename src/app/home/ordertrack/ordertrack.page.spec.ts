import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdertrackPage } from './ordertrack.page';

describe('OrdertrackPage', () => {
  let component: OrdertrackPage;
  let fixture: ComponentFixture<OrdertrackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdertrackPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdertrackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
