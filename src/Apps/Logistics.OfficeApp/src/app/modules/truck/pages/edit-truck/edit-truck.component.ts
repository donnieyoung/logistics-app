import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee, Truck } from '@shared/models';
import { ApiService } from '@shared/services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-truck',
  templateUrl: './edit-truck.component.html',
  styleUrls: ['./edit-truck.component.scss']
})
export class EditTruckComponent implements OnInit {
  public id?: string; 
  public isBusy: boolean;
  public editMode: boolean;
  public form: FormGroup;
  public headerText: string;
  public suggestedDrivers: Employee[];
  
  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
  ) 
  {
    this.suggestedDrivers = [];
    this.headerText = 'Edit a truck';
    this.isBusy = false;
    this.editMode = true;
    this.form = new FormGroup({
      'truckNumber': new FormControl(0, Validators.required),
      'driver': new FormControl('', Validators.required),
    });
  }

  public ngOnInit(): void {
    this.id = history.state.id;
    
    if (!this.id) {
      this.editMode = false;
      this.headerText = 'Add a new truck'
      return;
    }

    this.fetchTruck(this.id);
  }

  public searchDriver(event: any) {
    this.apiService.getDrivers(event.query).subscribe(result => {
      if (result.success && result.items) {
        this.suggestedDrivers = result.items;
      }
    });
  }

  public onSubmit() {
    const driver = this.form.value.driver as Employee;

    if (!driver) {
      this.messageService.add({key: 'notification', severity: 'error', summary: 'Error', detail: 'Select driver'});
      return;
    }
    
    const truck: Truck = {
      id: this.id,
      truckNumber: this.form.value.truckNumber,
      driverId: driver.externalId!
    }

    if (this.editMode) {
      this.apiService.updateTruck(truck).subscribe(result => {
        if (result.success) {
          this.messageService.add({key: 'notification', severity: 'success', summary: 'Notification', detail: 'Truck has been updated successfully'});
        }
      });
    }
    else {
      this.apiService.createTruck(truck).subscribe(result => {
        if (result.success) {
          this.messageService.add({key: 'notification', severity: 'success', summary: 'Notification', detail: 'Truck has been created successfully'});
        }

        this.form.reset();
      });
    }
  }

  private fetchTruck(id: string) {
    this.apiService.getTruck(id).subscribe(result => {
      if (result.success && result.value) {
        const truck = result.value;
        
        this.form.patchValue({
          truckNumber: truck?.truckNumber,
          driver: truck?.driverName,
        });
      }
    });
  }
}