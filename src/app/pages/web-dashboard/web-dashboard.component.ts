import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, JsonPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType,Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

Chart.register(ChartDataLabels);
import { faSearch,faEnvelope, faBuilding, faL } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-web-dashboard',
  imports: [
    // JsonPipe,
    CommonModule,
    BaseChartDirective,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    NgxSpinnerModule

  ],
  templateUrl: './web-dashboard.component.html',
  styleUrl: './web-dashboard.component.scss',
  providers: [provideNativeDateAdapter()],
  // changeDetection: ChangeDetectionStrategy.OnPush,
 })
export class WebDashboardComponent implements OnInit{
  // form
    searchForm!: FormGroup;
  // form
   camera = faSearch
  private unsubscribe$ = new Subject<void>();
  isLoading:boolean = false;
  breakup:any
  consolidate:any
  rdData:any[] = []
  fdData:any[] = []
  loanData:any[] = []
  disposit_withdrawlData:any[] = []
  topAssociatsData:any[] = []

  is_spinner: boolean = false

  new_memberData:any[] = []
  f_date: Date | null = null;
  l_date: Date | null = null;
  // charts
   // Chart type
   barChartType: ChartType = 'bar';
   pieChartType: ChartType = 'doughnut';

   // Chart options
  //  barChartOptions: ChartConfiguration['options'] = {
  //    responsive: true,
  //    plugins: {
  //      legend: {
  //        display: true

  //      },

  //    },
  //    scales: {
  //      x: {

  //      },
  //      y: {
  //        beginAtZero: true
  //      }
  //    }
  //  };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#000',
        font: {
          weight: 'bold'
        },
        formatter: (value: any) => {
          return value; // Customize if needed (e.g., `₹${value}`)
        }
      }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };

   // Chart data
   MemberChartData:any
   RdChartData:any
   FdChartData:any
   loanChartData:any
   disposit_withdrawlChartData:any
    topAssociatsChartData:any
  // charts
  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ){}
  ngOnInit(): void {
    this.is_spinner = true
    this.spinner.show()
    this.loadData()
    this.searchForm = this.loadForm()
  }
  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('start')?.value;
    const end = group.get('end')?.value;
    if (!start || !end) return null;
    return new Date(start) <= new Date(end) ? null : { dateRangeInvalid: true };
  }

  loadData(dates?: any) {
    // Reset state
    this.consolidate = "";
    this.breakup = [];
    this.rdData = [];
    this.fdData = [];
    this.new_memberData = [];
    this.loanData = [];

    // Optional: set loading spinner flag
    this.isLoading = true;
    this.is_spinner = true
    this.spinner.show()

    this.api.dashboard(dates)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          const data = response?.body;
          if (!data) return;

          this.breakup = data.breakup || {};
          this.consolidate = data.consolidate || '';
          this.rdData = this.breakup.rd || [];
          this.fdData = this.breakup.fd || [];
          this.new_memberData = this.breakup.new_members || [];
          this.loanData = data.merged_loans || [];
          this.disposit_withdrawlData = data.incoming_outgoing || [];
          this.topAssociatsData = data.top_associats || [];

          this.f_date = data.first_date;
          this.l_date = data.last_date;

          this.MemberChartData = this.buildChartData('New Members', this.new_memberData);
          this.RdChartData = this.buildChartData('RD Business', this.rdData);
          this.FdChartData = this.buildChartData('FD Business', this.fdData);
          this.loanChartData = this.buildChartData('Loan Business', this.loanData);
          this.disposit_withdrawlChartData = this.buildMultiLineChartData('Diposite Withdrawal', this.disposit_withdrawlData);
          this.topAssociatsChartData = this.AssociatChartData('Top Associates', this.topAssociatsData);
        },
        error: (error) => {
            this.is_spinner = false
            this.spinner.hide()
          console.error('Error loading dashboard:', error);
        },
        complete: () => {
          this.isLoading = false;
          this.is_spinner = false
          this.spinner.hide()
        }
      });
  }
  buildChartData(label: string, dataArray: any[]) {
    return {
      labels: dataArray.map(b => b.branch_code),
      datasets: [{
        label,
        data: dataArray.map(b => parseFloat(b.account)),
        backgroundColor: [
          'rgb(188, 16, 137)',
          'rgb(23, 165, 89)',
          'rgb(174, 152, 15)',
          'rgb(120, 20, 145)',
          'rgb(54, 162, 235)',
          'rgb(255, 125, 86)'
        ]
      }]
    };
  }
   AssociatChartData(label: string, dataArray: any[]) {
    return {
      labels: dataArray.map(b => b.name),
      datasets: [{
        label,
        data: dataArray.map(b => parseFloat(b.member_count)),
        backgroundColor: [
          'rgb(188, 16, 137)',
          'rgb(23, 165, 89)',
          'rgb(174, 152, 15)',
          'rgb(120, 20, 145)',
          'rgb(54, 162, 235)',
          'rgb(255, 125, 86)'
        ]
      }]
    };
  }

  buildMultiLineChartData(label: string, dataArray: any[]) {
  const labels = dataArray.map(b => b.branch_code);

  return {
    labels,
    datasets: [
      {
        label: 'Loan Amount',
        data: dataArray.map(b => parseFloat(b.loan_amount) || 0),
        borderColor: 'rgb(255, 99, 132)',
         backgroundColor: ['rgb(188, 16, 137)'],
        fill: false,
        tension: 0.1
      },
      {
        label: 'Deposit Amount',
        data: dataArray.map(b => parseFloat(b.deposit_account) || 0),
        borderColor: 'rgb(54, 162, 235)',
         backgroundColor: ['rgb(23, 165, 89)'],
        fill: false,
        tension: 0.1
      },
      {
        label: 'Withdrawal Amount',
        data: dataArray.map(b => parseFloat(b.withdrawal_amount) || 0),
        borderColor: 'rgb(255, 206, 86)',
         backgroundColor: ['rgb(255, 125, 86)'],
        fill: false,
        tension: 0.1
      }
    ]
  };
}



  loadForm(){
  return  this.fb.group({
      dateRange: this.fb.group({
        start: [null, Validators.required],
        end: [null, Validators.required],
      }, { validators: this.dateRangeValidator }),
      t: this.fb.control(null)
    },

  );
  }
  onSearch(){
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const dateRange = this.searchForm.get('dateRange')?.value;
    if (!dateRange.start || !dateRange.end) return;

    const payload = {
      start_date: this.formatDate(dateRange.start),
      end_date: this.formatDate(dateRange.end)
    };
    console.log()
    this.loadData(JSON.stringify(payload) );
    this.isLoading = false

  }
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }
}
