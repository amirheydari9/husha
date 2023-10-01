import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

var passwordValidator = require('password-validator');

export class CustomValidators {

  static mobile(control: AbstractControl): ValidationErrors | null {
    const mobileNumber = control.value;
    if (!mobileNumber) {
      return null;
    }
    const mobileRegex = new RegExp(/^09\d{9}$/);
    return mobileRegex.test(mobileNumber) ? null : {
      mobile: {message: 'شماره موبایل معتبر نمی باشد'}
    };
  }

  static url(control: AbstractControl): ValidationErrors | null {
    const url = control.value;
    if (!url) {
      return null;
    }
    const urlRegex = new RegExp(/^(http|https):\/\/([\w-]+(\.[\w-]+)+)(\/[\w-]+)*\/?$/);
    return urlRegex.test(url) ? null : {
      mobile: {message: 'آدرس اینترنتی معتبر نمی باشد'}
    };
  }

  static nationalCode(control: AbstractControl): ValidationErrors | null {
    const nationalCode = control.value;
    if (!nationalCode) {
      return null;
    }
    if (nationalCode.length !== 10 ||
      nationalCode === '1111111111' ||
      nationalCode === '2222222222' ||
      nationalCode === '3333333333' ||
      nationalCode === '4444444444' ||
      nationalCode === '5555555555' ||
      nationalCode === '6666666666' ||
      nationalCode === '7777777777' ||
      nationalCode === '8888888888' ||
      nationalCode === '9999999999') {
      return {
        nationalCode: {
          message: 'کد ملی نامعتبر است'
        }
      };
    }

    const c = Number(nationalCode.charAt(9));
    const n = Number(nationalCode.charAt(0)) * 10 +
      Number(nationalCode.charAt(1)) * 9 +
      Number(nationalCode.charAt(2)) * 8 +
      Number(nationalCode.charAt(3)) * 7 +
      Number(nationalCode.charAt(4)) * 6 +
      Number(nationalCode.charAt(5)) * 5 +
      Number(nationalCode.charAt(6)) * 4 +
      Number(nationalCode.charAt(7)) * 3 +
      Number(nationalCode.charAt(8)) * 2;
    const r = n - Math.floor(n / 11) * 11;
    return (r === 0 && r === c) || (r === 1 && c === 1) || (r > 1 && c === 11 - r)
      ? null
      : {
        nationalCode: {
          message: 'کد ملی نامعتبر است'
        }
      };
  }

  static passwordMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password.valid && confirmPassword.valid) {
      return password?.value === confirmPassword?.value ? null : {passwordMatch: {message: 'تکرار رمز اشتباه است'}};
    }
    return null
  };

  static postalCode(control: AbstractControl): ValidationErrors | null {
    const postalCode = control.value;
    if (!postalCode) {
      return null;
    }
    const postalCodeRegex = new RegExp(/^\d{10}$/);
    return postalCodeRegex.test(postalCode) ? null : {
      postalCode: {message: 'کد پستی نامعتبر است'}
    };
  }

  static authPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) {
      return null;
    }
    const schema = new passwordValidator();
    schema
      .is().min(8)
      .is().max(16)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().symbols()
      .has().not().spaces()
    // const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/);
    // console.log(passwordRegex.test(password))
    return schema.validate(password) ? null : {
      authPassword: {message: 'پسورد نامعتبر است'}
    };
  }

  static noWhitespace(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : {noWhitespace: {message: 'مقدار ورودی نامعتبر است '}}
  }

  static datePickerFormat(timeEnable: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const datePicker = control.value;
      if (!datePicker) {
        return null;
      }
      const dateRegex = timeEnable ? new RegExp(/^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/) : new RegExp(/^\d{4}\/\d{2}\/\d{2}$/)
      return dateRegex.test(datePicker) ? null : {
        mobile: {message: 'فرمت تاریخ نامعتبر است'}
      };
    }
  }

  static requiredFileType(types: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value
      if (!file) {
        return null
      }
      const fileFormatArr = file.name.split('.')
      if (fileFormatArr.length === 1) {
        return {requiredFileType: {message: 'فرمت فایل نامعتبر است'}};
      }
      const fileFormat = fileFormatArr.pop()
      return types.indexOf(fileFormat) > -1 ? null : {
        requiredFileType: {message: 'فرمت فایل نامعتبر است'}
      };
    }
  }

}
