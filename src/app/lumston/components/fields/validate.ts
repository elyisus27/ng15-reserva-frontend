import {
    AbstractControl,
    AsyncValidatorFn,
    Validator,
    Validators,
    ValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';

// tslint:disable-next-line:interface-over-type-literal
export type ValidationResult = {[validator: string]: string | boolean };
export type AsyncValidatorArray = Array<Validator | AsyncValidatorFn>;
export type ValidatorArray = Array<Validator | ValidatorFn>;

const normalizeValidator = (validator: Validator | ValidatorFn): ValidatorFn | AsyncValidatorFn => {
    const func = (validator as Validator).validate.bind(validator);
    if (typeof func === 'function') {
        return (c: AbstractControl) => func(c);
    } else {
        return <ValidatorFn | AsyncValidatorFn> validator;
    }
};

export const composeValidators = (validators: ValidatorArray): AsyncValidatorFn | ValidatorFn => {
    if (validators == null || validators.length === 0) {
        return null;
    }
    return Validators.compose(validators.map(normalizeValidator));
};

export const validate = (validators: ValidatorArray, asyncValidators: AsyncValidatorArray) => {
    return (control: AbstractControl) => {
        const synchronousValid = () => composeValidators(validators)(control);

        if (asyncValidators) {
            const asyncValidator = composeValidators(asyncValidators);

            return asyncValidator(control).map(v => {
                const secondary = synchronousValid();
                if (secondary || v) { // compose async and sync validator results
                    return Object.assign({}, secondary, v);
                }
            });
        }

        if (validators) {
            return of(synchronousValid());
        }

        return of(null);
    };
};

export const message = (validator: ValidationResult, key: string): string => {
    switch (key) {
        case 'required':
            return 'Debes insertar un valor';
        case 'pattern':
            return 'El formato del valor insertado es inválido';
        case 'minlength':
            return `Debes introducir un mínimo de ${validator.minlength['requiredLength']} carácteres`;
        case 'maxlength':
            return `Debes introducir un máximo de ${validator.maxlength['requiredLength']} carácteres`;
    }

    if (typeof validator[key] === 'string') {
        return <string> validator[key];
    } else {
        return `Validation failed: ${key}`;
    }
};
