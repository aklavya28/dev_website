import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-fd-calculator',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './fd-calculator.component.html',
  styleUrls: ['./fd-calculator.component.scss']
})
export class FdCalculatorComponent implements OnInit, AfterViewInit {
  // fdForm: FormGroup;
  calculatorForm: FormGroup;
  @ViewChild('pieChart') pieChart: ElementRef | undefined;
  chart: any;
  
  // Dropdown state
  isDropdownOpen: boolean = false;
  // Calculator type
  calculatorType: string = 'fd'; // 'fd' or 'rd'
  // Result variables
  totalInvestment: number = 100000;
  interestRate: number = 6.5;
  timePeriod: number = 5;
  periodType: string = 'Yr'; // 'Yr' or 'Mo'
  compoundingFrequency: string = 'quarterly'; // 'yearly', 'half-yearly', 'quarterly', 'monthly', 'simple'
  
  // Constants
  minInvestment: number = 1000;
  maxInvestment: number = 1000000;
  minMonthlyInstallment: number = 100;

  // Calculated values
  maturityAmount: number = 138042;
  estimatedReturns: number = 38042;
  totalValue: number = 138042;
  // RD specific variables
  monthlyInstallment: number = 10000;


  // Slider values
  investmentSliderValue: number = 50;  // Percentage value for slider position
  interestSliderValue: number = 50;    // Percentage value for slider position
  timeSliderValue: number = 50;        // Percentage value for slider position
  
  constructor(private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef) {
    this.calculatorForm = this.fb.group({
      calculatorType: [this.calculatorType],
      totalInvestment: [this.totalInvestment, [Validators.required, Validators.min(this.minInvestment)]],
      monthlyInstallment: [this.monthlyInstallment, [Validators.required, Validators.min(this.minMonthlyInstallment)]],
      interestRate: [this.interestRate, [Validators.required, Validators.min(0.1), Validators.max(15)]],
      timePeriod: [this.timePeriod, [Validators.required, Validators.min(1)]],
      periodType: [this.periodType],
      compoundingFrequency: [this.compoundingFrequency]
    });
  }

  // ngOnInit(): void {
  //   // Set initial values
  //   this.calculateFD();
    
  //   // Subscribe to form changes
  //   this.fdForm.valueChanges.subscribe(() => {
  //     this.totalInvestment = this.fdForm.value.totalInvestment;
  //     this.interestRate = this.fdForm.value.interestRate;
  //     this.timePeriod = this.fdForm.value.timePeriod;
  //     this.periodType = this.fdForm.value.periodType;
  //     this.compoundingFrequency = this.fdForm.value.compoundingFrequency;
      
  //     this.calculateFD();
  //     this.updateChart();
  //   });
  // }

  ngOnInit(): void {
    // Set initial values
    // this.calculateReturns();
    
    // Subscribe to form changes
    this.calculatorForm.valueChanges.subscribe(() => {
      this.calculatorType = this.calculatorForm.value.calculatorType;
      
      if (this.calculatorType === 'fd') {
        this.totalInvestment = this.calculatorForm.value.totalInvestment;
      } else {
        this.monthlyInstallment = this.calculatorForm.value.monthlyInstallment;
      }
      
      this.interestRate = this.calculatorForm.value.interestRate;
      this.timePeriod = this.calculatorForm.value.timePeriod;
      this.periodType = this.calculatorForm.value.periodType;
      this.compoundingFrequency = this.calculatorForm.value.compoundingFrequency;
      
      this.calculateReturns();
      this.updateChart();
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart(): void {
    const ctx = this.pieChart?.nativeElement.getContext('2d');
  
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Total Interest', 'Deposit Amount'],
        datasets: [{
          data: [this.estimatedReturns, this.totalInvestment],
          backgroundColor: [
            '#fb3c00',  // returns
            '#0b6bab'  // investment
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                return `${label}: ₹${(value as number).toLocaleString('en-IN')}`;
              }
            }
          }
        }
      }
    });
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.estimatedReturns, this.totalInvestment];
      this.chart.update();
    }
  }

  calculateReturns(): void {
    if (this.calculatorType === 'fd') {
      this.calculateFD();
    } else {
      this.calculateRD();
    }
  }

  calculateRD(): void {
    // Convert time period to months for calculation
    let timeInMonths = this.timePeriod;
    if (this.periodType === 'Yr') {
      timeInMonths = this.timePeriod * 12;
    } else if (this.periodType === 'Dy') {
      timeInMonths = Math.round(this.timePeriod / 30.417);
      
    }
    
    const monthlyDeposit = this.monthlyInstallment;
    const ratePerMonth = this.interestRate / 100 / 12;
    const n = timeInMonths;
    
    // RD formula: M = P × (1 + r)^n + P × (1 + r)^(n-1) + ... + P × (1 + r)
    // Simplified formula: M = P × ((1 + r)^n - 1) / r × (1 + r)
    let compoundingFactor;
    
    switch (this.compoundingFrequency) {
      case 'quarterly':
        // For quarterly compounding in RD, interest is calculated quarterly but payment is monthly
        const quarterlyRate = this.interestRate / 100 / 4;
        const quarters = timeInMonths / 3;
        
        // Sum of each month's deposit with compound interest for remaining quarters
        let totalAmount = 0;
        for (let i = 0; i < timeInMonths; i++) {
          const remainingQuarters = Math.floor((timeInMonths - i - 1) / 3);
          totalAmount += monthlyDeposit * Math.pow(1 + quarterlyRate, remainingQuarters);
        }
        this.maturityAmount = totalAmount;
        break;
        
      case 'monthly':
        // For monthly compounding, we can use the simpler formula
        this.maturityAmount = monthlyDeposit * ((Math.pow(1 + ratePerMonth, n) - 1) / ratePerMonth) * (1 + ratePerMonth);
        break;
        
      case 'yearly':
        // For yearly compounding in RD
        const yearlyRate = this.interestRate / 100;
        
        // Calculate each deposit with yearly compounding
        let total = 0;
        for (let i = 0; i < timeInMonths; i++) {
          const remainingYears = (timeInMonths - i - 1) / 12;
          total += monthlyDeposit * Math.pow(1 + yearlyRate, remainingYears);
        }
        this.maturityAmount = total;
        break;
        
      case 'half-yearly':
        // For half-yearly compounding in RD
        const halfYearlyRate = this.interestRate / 100 / 2;
        
        // Calculate each deposit with half-yearly compounding
        let totalHalfYearly = 0;
        for (let i = 0; i < timeInMonths; i++) {
          const remainingHalfYears = Math.floor((timeInMonths - i - 1) / 6);
          totalHalfYearly += monthlyDeposit * Math.pow(1 + halfYearlyRate, remainingHalfYears);
        }
        this.maturityAmount = totalHalfYearly;
        break;
        
      case 'simple':
        // Simple interest for RD
        let totalSimple = 0;
        for (let i = 0; i < timeInMonths; i++) {
          const monthsRemaining = timeInMonths - i - 1;
          const interest = monthlyDeposit * (this.interestRate / 100) * (monthsRemaining / 12);
          totalSimple += monthlyDeposit + interest;
        }
        this.maturityAmount = totalSimple;
        break;
        
      default:
        // Default to quarterly compounding which is standard for RDs
        const defaultQuarterlyRate = this.interestRate / 100 / 4;
        const defaultQuarters = n / 3;
        
        let defaultTotalAmount = 0;
        for (let i = 0; i < n; i++) {
          const defaultRemainingQuarters = Math.floor((n - i - 1) / 3);
          defaultTotalAmount += monthlyDeposit * Math.pow(1 + defaultQuarterlyRate, defaultRemainingQuarters);
        }
        this.maturityAmount = defaultTotalAmount;
    }
    
    this.maturityAmount = Math.round(this.maturityAmount);
    this.totalInvestment = monthlyDeposit * timeInMonths;
    this.totalValue = this.maturityAmount;
    this.estimatedReturns = this.maturityAmount - this.totalInvestment;
  }

  calculateFD(): void {
    // Convert time period to years for calculation
    let timeInYears = this.timePeriod;
    if (this.periodType === 'Mo') {
      timeInYears = this.timePeriod / 12;
    } else if (this.periodType === 'Dy') {
      timeInYears = this.timePeriod / 365;
    } else if (this.periodType === 'Yr') {
      timeInYears = this.timePeriod;
    }
    
    // Calculate interest using compound interest formula
    // this.estimatedReturns = Math.round(this.totalInvestment * (Math.pow(1 + (this.interestRate / 100), timeInYears) - 1));
    // this.totalValue = this.totalInvestment + this.estimatedReturns;

    let n = 4; // e.g., 1=yearly, 4=quarterly, 12=monthly
    if (this.compoundingFrequency === 'yearly') {
      n = 1;
    } else if (this.compoundingFrequency === 'half-yearly') {
      n = 2;
    } else if (this.compoundingFrequency === 'quarterly') {
      n = 4;
    } else if (this.compoundingFrequency === 'monthly') {
      n = 12;
    } else if (this.compoundingFrequency === 'simple') {
      n = 0;
    }
    const amount = this.totalInvestment * Math.pow(1 + (this.interestRate / 100) / n, n * timeInYears);
    // const simple_interest = this.totalInvestment * (this.interestRate / 100) * timeInYears;
    // const amount = this.compoundingFrequency === 'simple' ? simple_interest : this.totalInvestment * Math.pow(1 + (this.interestRate / 100) / n, n * timeInYears);

    this.totalValue = Math.round(amount);
    this.estimatedReturns = this.totalValue - this.totalInvestment;

    
  }
  getCompoundingText(): string {
    switch (this.compoundingFrequency) {
      case 'yearly':
        return 'Yearly';
      case 'half-yearly':
        return 'Half-Yearly';
      case 'quarterly':
        return 'Quarterly';
      case 'monthly':
        return 'Monthly';
      case 'simple':
        return 'Simple Interest';
      default:
        return 'Yearly';
    }
  }

  // updateInvestmentSlider(event: Event): void {
  //   const target = event.target as HTMLInputElement;
  //   this.investmentSliderValue = parseFloat(target.value);
  //   this.totalInvestment = Math.round(this.mapSliderToValue(this.investmentSliderValue, this.minInvestment, 1000000));
  //   this.calculatorForm.patchValue({ totalInvestment: this.totalInvestment }, { emitEvent: false });
  //   this.calculateFD();
  //   this.updateChart();
  // }

  updateInvestmentSlider(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.investmentSliderValue = parseFloat(target.value);

    if (this.calculatorType === 'fd') {
      this.totalInvestment = Math.round(this.mapSliderToValue(this.investmentSliderValue, this.minInvestment, 1000000));
      this.calculatorForm.patchValue({ totalInvestment: this.totalInvestment }, { emitEvent: false });
    } else {
      this.monthlyInstallment = Math.round(this.mapSliderToValue(this.investmentSliderValue, this.minMonthlyInstallment, 100000));
      this.calculatorForm.patchValue({ monthlyInstallment: this.monthlyInstallment }, { emitEvent: false });
    }
    
    this.calculateReturns();
    this.updateChart();
  }
  
  updateInterestSlider(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.interestSliderValue = parseFloat(target.value);
    this.interestRate = parseFloat(this.mapSliderToValue(this.interestSliderValue, 1, 15).toFixed(1));
    this.calculatorForm.patchValue({ interestRate: this.interestRate }, { emitEvent: false });
    this.calculateReturns();
    this.updateChart();
  }
  
  updateTimeSlider(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.timeSliderValue = parseFloat(target.value);
    
    // if (this.periodType === 'Yr') {
    //   this.timePeriod = Math.round(this.mapSliderToValue(this.timeSliderValue, 1, 10));
    // } else {
    //   this.timePeriod = Math.round(this.mapSliderToValue(this.timeSliderValue, 1, 120));
    // }
    let maxTime;
    switch(this.periodType) {
      case 'Yr':
        maxTime = 10;
        break;
      case 'Mo':
        maxTime = 120;
        break;
      case 'Dy':
        maxTime = 365;
        break;
      default:
        maxTime = 10;
    }
    
    this.timePeriod = Math.round(this.mapSliderToValue(this.timeSliderValue, 1, maxTime));
    
    this.calculatorForm.patchValue({ timePeriod: this.timePeriod }, { emitEvent: false });
    // this.calculateFD();
    this.calculateReturns();
    this.updateChart();
  }
  
  togglePeriodType(newType: string): void {
    // const types = ['Yr', 'Mo', 'Dy'];
    // const currentIndex = types.indexOf(this.periodType);
    // this.periodType = types[(currentIndex + 1) % types.length];
    // this.periodType = this.periodType === 'Yr' ? 'Mo' : 'Yr';
    if (this.periodType === newType) return;
    
    const oldType = this.periodType;
    this.periodType = newType;
    
    // Convert time period value when switching
    // if (this.periodType === 'Mo') {
    //   this.timePeriod = this.timePeriod * 12;
    // } else if (this.periodType === 'Dy') {
    //   this.timePeriod = this.timePeriod * 365;
    // } else {
    //   this.timePeriod = Math.max(1, Math.round(this.timePeriod / 12));
    // }
     // Convert time period value when switching
     if (oldType === 'Yr') {
      if (newType === 'Mo') {
        this.timePeriod = this.timePeriod * 12;
      } else if (newType === 'Dy') {
        this.timePeriod = this.timePeriod * 365;
      }
    } else if (oldType === 'Mo') {
      if (newType === 'Yr') {
        this.timePeriod = Math.max(1, Math.round(this.timePeriod / 12));
      } else if (newType === 'Dy') {
        this.timePeriod = Math.round(this.timePeriod * 30.417); // Average days in a month
      }
    } else if (oldType === 'Dy') {
      if (newType === 'Yr') {
        this.timePeriod = Math.max(1, Math.round(this.timePeriod / 365));
      } else if (newType === 'Mo') {
        this.timePeriod = Math.max(1, Math.round(this.timePeriod / 30.417)); // Average days in a month
      }
    }
    
    
    this.calculatorForm.patchValue({ 
      periodType: this.periodType,
      timePeriod: this.timePeriod 
    }, { emitEvent: false });
    
    // this.calculateFD();
    this.calculateReturns();
    this.updateChart();

      // Reset slider according to new period type
      let maxTime;
        
      switch(this.periodType) {
        case 'Yr':
          maxTime = 10;
          break;
        case 'Mo':
          maxTime = 120;
          break;
        case 'Dy':
          maxTime = 365;
          break;
        default:
          maxTime = 10;
      }
      this.timeSliderValue = this.mapValueToSlider(this.timePeriod, 1, maxTime);
  }
  
  // Utility function to map slider values (0-100) to actual values in specific ranges
  mapSliderToValue(percent: number, min: number, max: number): number {
    return min + (percent / 100) * (max - min);
  }
  
  // Format currency for display (Indian format)
  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-IN');
  }
  
  // onInvestmentChange(event: Event): void {
  //   const target = event.target as HTMLInputElement;
  //   this.totalInvestment = parseFloat(target.value);
  //   this.investmentSliderValue = this.mapValueToSlider(this.totalInvestment, 1000, 1000000);
  //   this.calculateFD();
  //   this.updateChart();
  // }

  onInvestmentChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (this.calculatorType === 'fd') {
      this.totalInvestment = parseFloat(target.value);
      
      // Enforce minimum investment amount
      if (this.totalInvestment < this.minInvestment) {
        this.totalInvestment = this.minInvestment;
        this.calculatorForm.patchValue({ totalInvestment: this.totalInvestment }, { emitEvent: false });
      }
      
      this.investmentSliderValue = this.mapValueToSlider(this.totalInvestment, this.minInvestment, 1000000);
    } else {
      this.monthlyInstallment = parseFloat(target.value);
      
      // Enforce minimum monthly installment amount
      if (this.monthlyInstallment < this.minMonthlyInstallment) {
        this.monthlyInstallment = this.minMonthlyInstallment;
        this.calculatorForm.patchValue({ monthlyInstallment: this.monthlyInstallment }, { emitEvent: false });
      }
      this.investmentSliderValue = this.mapValueToSlider(this.monthlyInstallment, this.minMonthlyInstallment, 100000);
    }
    
    this.calculateReturns();
    this.updateChart();
  }
  
  onInterestChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.interestRate = parseFloat(target.value);
    this.interestSliderValue = this.mapValueToSlider(this.interestRate, 1, 15);
    // this.calculateFD();
    this.calculateReturns();
    this.updateChart();
  }
  
  onTimeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.timePeriod = parseFloat(target.value);
    
    // let maxTime = this.periodType === 'Yr' ? 10 : 120;
    let maxTime;
    // this.timeSliderValue = this.mapValueToSlider(this.timePeriod, 1, maxTime);
    switch(this.periodType) {
      case 'Yr':
        maxTime = 10;
        break;
      case 'Mo':
        maxTime = 120;
        break;
      case 'Dy':
        maxTime = 365;
        break;
      default:
        maxTime = 10;
    }
    
    this.timeSliderValue = this.mapValueToSlider(this.timePeriod, 1, maxTime);
    // this.calculateFD();
    this.calculateReturns();
    this.updateChart();
  }
  
  // Map actual values back to slider percentages
  mapValueToSlider(value: number, min: number, max: number): number {
    return ((value - min) / (max - min)) * 100;
  }

  // Get heading text based on calculator type
  getCalculatorTitle(): string {
    return this.calculatorType === 'fd' ? 'FD Calculator' : 'RD Calculator';
  }

  // Animation for calculator type change
  changeCalculatorType(type: string): void {
  if (this.calculatorType === type) return;
  
  // Add fade-out class to form
  const formElement = document.querySelector('.inputs-section form');
  if (formElement) {
    formElement.classList.add('fade-out');
    
    // Wait for animation to complete before changing
    setTimeout(() => {
      // Change calculator type
      this.calculatorType = type;
      this.calculatorForm.patchValue({ calculatorType: this.calculatorType }, { emitEvent: false });
      
      // Reset investment slider position
      if (this.calculatorType === 'fd') {
        this.investmentSliderValue = this.mapValueToSlider(this.totalInvestment, this.minInvestment, 1000000);
      } else {
        this.investmentSliderValue = this.mapValueToSlider(this.monthlyInstallment, this.minMonthlyInstallment, 100000);
      }
      
      // Calculate new values
      this.calculateReturns();
      this.updateChart();
      
      // Remove fade-out class and add fade-in class
      formElement.classList.remove('fade-out');
      formElement.classList.add('fade-in');
      
      // Remove fade-in class after animation completes
      setTimeout(() => {
        formElement.classList.remove('fade-in');
      }, 300);
      
      // Close dropdown
      this.isDropdownOpen = false;
    }, 200);
  } else {
    // Fallback if animation doesn't work
    this.calculatorType = type;
    this.calculatorForm.patchValue({ calculatorType: this.calculatorType }, { emitEvent: false });
    this.calculateReturns();
    this.updateChart();
    this.isDropdownOpen = false;
  }
}

// Toggle dropdown with animation
toggleDropdown1(): void {
  this.isDropdownOpen = !this.isDropdownOpen;
  
  if (this.isDropdownOpen) {
    // Add event listener to close dropdown when clicking outside
    setTimeout(() => {
      document.addEventListener('click', this.closeDropdownOnClickOutside);
    }, 0);
  }
}

// Close dropdown when clicking outside
closeDropdownOnClickOutside = (event: MouseEvent) => {
  const dropdown = document.querySelector('.dropdown');
  if (dropdown && !dropdown.contains(event.target as Node)) {
    this.isDropdownOpen = false;
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
    this.changeDetectorRef.detectChanges(); // Add this to detect changes
  }
};

// Highlight active calculator type in dropdown
isActiveCalculator(type: string): boolean {
  return this.calculatorType === type;
}

// Clean up event listeners when component is destroyed
ngOnDestroy(): void {
  document.removeEventListener('click', this.closeDropdownOnClickOutside);
}

// Improved toggleDropdown function for FD/RD calculator
toggleDropdown(): void {
  this.isDropdownOpen = !this.isDropdownOpen;
  
  // If dropdown is open, add a click event listener to close it when clicking outside
  if (this.isDropdownOpen) {
    setTimeout(() => {
      const closeDropdownHandler = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const dropdown = document.querySelector('.dropdown');
        
        // Close if click is outside the dropdown
        if (dropdown && !dropdown.contains(target)) {
          this.isDropdownOpen = false;
          document.removeEventListener('click', closeDropdownHandler);
          this.changeDetectorRef.detectChanges(); // Force Angular change detection
        }
      };
      
      document.addEventListener('click', closeDropdownHandler);
    }, 0);
  }
}

// Function to change calculator type with animation
changeCalculatorType1(type: 'fd' | 'rd'): void {
  // Apply fade out effect
  const form = document.querySelector('.inputs-section form');
  if (form) {
    form.classList.add('fade-out');
  }
  
  // Short delay before changing calculator type
  setTimeout(() => {
    this.calculatorType = type;
    this.isDropdownOpen = false;
    
    // Reset form or initialize with default values for the selected calculator
    if (type === 'fd') {
      this.calculatorForm.patchValue({
        totalInvestment: 380000,
        interestRate: 8.1,
        timePeriod: 180,
        compoundingFrequency: 'quarterly'
      });
    } else {
      this.calculatorForm.patchValue({
        totalInvestment: 10000,
        interestRate: 7.5,
        timePeriod: 60,
        compoundingFrequency: 'monthly'
      });
    }
    
    // Recalculate values
    this.calculateReturns();
    
    // Apply fade in effect
    setTimeout(() => {
      if (form) {
        form.classList.remove('fade-out');
        form.classList.add('fade-in');
        
        // Remove class after animation
        setTimeout(() => {
          form.classList.remove('fade-in');
        }, 300);
      }
    }, 50);
    
  }, 200);
}

}