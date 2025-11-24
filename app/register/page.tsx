'use client';
import { useEffect, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { usePartnerRegistration } from '@/hooks/usePartnerRegistration';
import HeroSection from '@/components/register/HeroSection';
import BenefitsSection from '@/components/register/BenefitsSection';
import Step1BasicBusiness from '@/components/register/Step1BasicBusiness';
import Step2ContactInfo from '@/components/register/Step2ContactInfo';
import Step3LegalInfo from '@/components/register/Step3LegalInfo';
import Step4BusinessDetails from '@/components/register/Step4BusinessDetails';
import Step5AccountSetup from '@/components/register/Step5AccountSetup';
import FormNavigation from '@/components/register/FormNavigation';

import SuccessScreen from '@/components/register/SuccessScreen';
import TermsModal from '@/components/register/TermsModal';
import PrivacyModal from '@/components/register/PrivacyModal';
import MissingFieldsModal from '@/components/register/MissingFieldsModal';

export default function PartnerPage() {
  const {
    formData,
    currentStep,
    fieldErrors,
    checkingField,
    checkedField,
    suggestedSlugs,
    triggerRegenerateSuggestions,
    showPwdTooltip,
    pwdChecks,
    showCopyPasteTooltip,
    handlePreventCopyPaste,
    handleInputChange,
    showTermsModal,
    setShowTermsModal,
    showPrivacyModal,
    setShowPrivacyModal,
    showMissingFieldsModal,
    setShowMissingFieldsModal,
    validateSocialMediaURL,
    isValidURL,
    fieldLabel,
    missingFields,
    completedSteps,
    incompleteSteps,
    isFormValid,
    isSubmitting,
    isSubmitted,
    handleNextStep,
    handlePreviousStep,
    handleSubmit,
    showMissingFields,
    downloadPDF,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleStepClick
  } = usePartnerRegistration();

  const formRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStep]);

  useEffect(() => {
    if (isSubmitted && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth' });
      successRef.current.focus();
    }
  }, [isSubmitted]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1BasicBusiness
            formData={formData}
            handleInputChange={handleInputChange}
            fieldErrors={fieldErrors}
          />
        );
      case 1:
        return (
          <Step2ContactInfo
            formData={formData}
            handleInputChange={handleInputChange}
            fieldErrors={fieldErrors}
            checkingField={checkingField}
            checkedField={checkedField}
            suggestedSlugs={suggestedSlugs}
            triggerRegenerateSuggestions={triggerRegenerateSuggestions}
            validateSocialMediaURL={validateSocialMediaURL}
            isValidURL={isValidURL}
          />
        );
      case 2:
        return (
          <Step3LegalInfo
            formData={formData}
            handleInputChange={handleInputChange}
            fieldErrors={fieldErrors}
            checkingField={checkingField}
          />
        );
      case 3:
        return (
          <Step4BusinessDetails
            formData={formData}
            handleInputChange={handleInputChange}
            fieldErrors={fieldErrors}
          />
        );
      case 4:
        return (
          <Step5AccountSetup
            formData={formData}
            handleInputChange={handleInputChange}
            fieldErrors={fieldErrors}
            showPwdTooltip={showPwdTooltip}
            pwdChecks={pwdChecks}
            showCopyPasteTooltip={showCopyPasteTooltip}
            handlePreventCopyPaste={handlePreventCopyPaste}
            setShowTermsModal={setShowTermsModal}
            setShowPrivacyModal={setShowPrivacyModal}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <BenefitsSection />

      <div ref={formRef} className="max-w-4xl mx-auto py-12 px-4">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {renderCurrentStep()}
            <FormNavigation
              currentStep={currentStep}
              completedSteps={completedSteps}
              incompleteSteps={incompleteSteps}
              isFormValid={!!isFormValid}
              isSubmitting={isSubmitting}
              handlePreviousStep={handlePreviousStep}
              handleNextStep={handleNextStep}
              handleSubmit={handleSubmit}
              showMissingFields={showMissingFields}
              handleStepClick={handleStepClick}
            />
          </form>
        ) : (
          <div ref={successRef} tabIndex={-1}>
            <SuccessScreen visible={isSubmitted} formData={formData} downloadPDF={downloadPDF} />
          </div>
        )}
      </div>

      <TermsModal open={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal open={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <MissingFieldsModal
        open={showMissingFieldsModal}
        onClose={() => setShowMissingFieldsModal(false)}
        missingFields={missingFields}
        fieldLabel={fieldLabel}
      />

      <Footer />
    </div>
  );
}
