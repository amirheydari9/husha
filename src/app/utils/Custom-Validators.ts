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

  static cardNumber(control: AbstractControl): ValidationErrors | null {
    const cardNumber = control.value;
    if (!cardNumber) {
      return null;
    }
    const L = cardNumber.length;
    if (
      L < 16
      || parseInt(cardNumber.substr(1, 10), 10) == 0
      || parseInt(cardNumber.substr(10, 6), 10) == 0
    ) {
      return {
        cardNumber: {
          message: 'شماره کارت نامعتبر است'
        }
      };
    }
    const c = parseInt(cardNumber.substr(15, 1), 10);
    let s = 0;
    let k, d;
    for (let i = 0; i < 16; i++) {
      k = (i % 2 == 0) ? 2 : 1;
      d = parseInt(cardNumber.substr(i, 1), 10) * k;
      s += (d > 9) ? d - 9 : d;
    }
    return ((s % 10) == 0)
      ? null
      : {
        cardNumber: {
          message: 'شماره کارت نامعتبر است'
        }
      };
  }

  static cvv2(control: AbstractControl): ValidationErrors | null {
    const cvv2 = control.value;
    if (!cvv2) {
      return null;
    }
    const cvv2Regex = new RegExp(/^\d{3,4}$/);
    return cvv2Regex.test(cvv2) ? null : {
      cvv2: {
        message: 'cvv2 نامعتبراست'
      }
    };
  };

  static passwordMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password.valid && confirmPassword.valid) {
      return password?.value === confirmPassword?.value ? null : {passwordMatch: {message: 'تکرار رمز اشتباه است'}};
    }
    return null
  };

  static cardPassword(control: AbstractControl): ValidationErrors | null {
    const cardPassword = control.value;
    if (!cardPassword) {
      return null;
    }
    const cardPasswordRegex = new RegExp(/^\d{4}$/);
    return cardPasswordRegex.test(cardPassword) ? null : {
      cardPassword: {
        message: 'رمز کارت نامعتبر است'
      }
    };
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
}
