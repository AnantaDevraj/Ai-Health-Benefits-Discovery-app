export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <lottie-player src="https://assets6.lottiefiles.com/packages/lf20_usmfx6bp.json" background="transparent" speed="1" style={{ width: 80, height: 80 }} loop autoplay></lottie-player>
      <div className="text-sm opacity-70">{label}</div>
    </div>
  )
}


