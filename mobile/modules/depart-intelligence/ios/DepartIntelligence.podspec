Pod::Spec.new do |s|
  s.name = 'DepartIntelligence'
  s.version = '1.0.0'
  s.summary = 'Local preparation intelligence and image comparison'
  s.description = s.summary
  s.license = { :type => 'Proprietary' }
  s.author = 'DEPART'
  s.homepage = 'https://example.invalid/depart'
  s.platforms = { :ios => '18.0' }
  s.source = { :path => '.' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.swift'
  s.frameworks = 'FoundationModels', 'Vision', 'UIKit'
  s.swift_version = '6.0'
end
