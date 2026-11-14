Pod::Spec.new do |s|
  s.name = 'CasitaDexPlusStore'
  s.version = '1.0.0'
  s.summary = 'On-device StoreKit entitlement verification for CasitaDex'
  s.description = s.summary
  s.license = { :type => 'Proprietary' }
  s.author = 'Designs by F&A'
  s.homepage = 'https://github.com/netid2000-ui/CasitaDex'
  s.source = { :git => s.homepage + '.git' }
  s.platforms = { :ios => '16.4' }
  s.swift_version = '5.9'
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.frameworks = 'StoreKit'
  s.source_files = '*.swift'
end
