import Foundation
import FoundationModels

nonisolated enum LocalModelStatus: Equatable, Sendable {
    case available, deviceNotEligible, intelligenceDisabled, modelNotReady, unknown

    var title: String {
        switch self {
        case .available: "Model available"
        case .deviceNotEligible: "Unsupported device"
        case .intelligenceDisabled: "Apple Intelligence is off"
        case .modelNotReady: "Model is not ready"
        case .unknown: "Model unavailable"
        }
    }
    var explanation: String {
        switch self {
        case .available: "The on-device model is available. Checklist generation is not enabled in this build."
        case .deviceNotEligible: "This device cannot use the on-device system model. Manual checklists still work."
        case .intelligenceDisabled: "Turn on Apple Intelligence in iPhone Settings to make the on-device model available."
        case .modelNotReady: "The model has not finished becoming available. Check Apple Intelligence in iPhone Settings and try again."
        case .unknown: "The system reported an unavailable model. Manual checklists still work."
        }
    }
}

final class ModelAvailabilityService {
    func currentStatus() -> LocalModelStatus {
        switch SystemLanguageModel.default.availability {
        case .available: .available
        case .unavailable(let reason):
            switch reason {
            case .deviceNotEligible: .deviceNotEligible
            case .appleIntelligenceNotEnabled: .intelligenceDisabled
            case .modelNotReady: .modelNotReady
            @unknown default: .unknown
            }
        }
    }
}
