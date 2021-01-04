import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShopdetailPage } from './shopdetail.page';

describe('ShopdetailPage', () => {
  let component: ShopdetailPage;
  let fixture: ComponentFixture<ShopdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopdetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
