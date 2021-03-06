import { tsx } from "springtype/web/vdom";
import { MatInput, MatForm } from "st-materialize";
import { email, minLength, required } from "springtype/core/validate";
import { RegisterPage } from "./register";
import { LogoRow } from "../../../component/logo-row/logo-row";
import { TERMS_OF_USE_URL, PRIVACY_STATEMENT_URL } from "../../../config/website-urls";
import { st } from "springtype/core";
import { T } from "springtype/web/i18n/t";
import { Center } from "../../../component/center/center";

export default (component: RegisterPage) => (
    <fragment>
        <div class="container">
            <LogoRow />
            <MatForm ref={{ formRef: component }} class="col s12">
                <div class="row">
                    <MatInput name="email" label={st.t("E-mail")}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Your e-mail address")}
                        validators={[required, email]}
                        validationErrorMessages={{
                            required: st.t("This is a required field"),
                            'email': st.t("Not a valid e-mail address")
                        }}>
                    </MatInput>
                    <MatInput name="password" label={st.t("Password")} type="password"
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Choose your password")}
                        validators={[required, minLength(7)]}
                        validationErrorMessages={{
                            required: st.t("This is a required field"),
                            'min-length': st.t("Your password must consist of at least 7 characters")
                        }}>
                    </MatInput>
                    <MatInput name="password_again" label={st.t("Password confirmation")} type="password"
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Confirm your password")}
                        validators={[required, minLength(7)]}
                        validationErrorMessages={{
                            required: st.t("This is a required field"),
                            'min-length': st.t("Your password must consist of at least 7 characters")
                        }}>
                    </MatInput>
                </div>

                <div class="row">
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}>
                        {st.t("Please note our")} <a href={TERMS_OF_USE_URL} target="_blank">{st.t("Terms of Use")}</a> {st.t("and")} <a href={PRIVACY_STATEMENT_URL} target="_blank">{st.t("Privacy Statement")}</a> {st.t("/korean/special1")}
                    </div>
                </div>

                <div class="row" ref={{ errorMessage: component }}>

                </div>
                <div class="row">
                <Center>
                    <T tag="h5">Test Mode</T>
                    <strong>
                    <T tag="p" class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}>
                        Please note that Colivery runs in test mode right now. We will delete all user accounts and data at the end of the test mode timeframe.
                    </T>
                    </strong>
                </Center>
                </div>
                <div class="row">
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's5', 'offset-m3', 'm2', 'offset-l3', 'l2']}
                        onClick={() => component.onBackClick()}>{st.t("Back")}</a>
                    <div class="col s2 m2 l2"></div>
                    <a ref={{ nextButton: component }} class={['waves-effect', 'waves-light', 'btn', 'col', 's5', 'm2', 'l2']}
                        onClick={() => component.onNextClick()}>{st.t("Next")}</a>
                </div>
            </MatForm>
        </div>
    </fragment>
)

export interface IRegisterFormState {
    email: string;
    password: string;
    password_again: string;
}
